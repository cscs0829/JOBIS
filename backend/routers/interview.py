# Routers/interview.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from typing import Dict, List
import os
from dotenv import load_dotenv # load_dotenv로 .env 파일에 api 키 가져옴
import asyncpg
from DB.Connection import get_db_connection

# VectorDB 관리 추가 4/23 추가
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

router = APIRouter(tags=["interview"])

openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class DetailInsertRequest(BaseModel):
    intr_idx: int
    talk_person: str
    talk_content: str

class Message(BaseModel):
    role: str
    content: str

# Pydantic 모델
class InterviewStartRequest(BaseModel):
    persona: str
    job: str
    interviewType: str
    selectedMode: str
    mem_id: str # 유사 문장 검색을 위해 필요!
    messages: list[Message]

class InterviewRequest(BaseModel):
    persona: str
    job: str
    interviewType: str
    selectedMode: str
    messages: list[Message]

class QuestionFeedback(BaseModel):
    question: str
    answer: str
    feedback: str
    score: int

class InterviewFeedbackData(BaseModel):
    overallScore: int
    scores: Dict[str, int]
    questionFeedbacks: List[QuestionFeedback]
    finalFeedback: str

# 실제 DB insert 함수
async def create_interview_session(persona: str, job: str, interviewType: str, mem_id: str):
    conn = await get_db_connection()
    query = """
        INSERT INTO tb_interview (interviewer_psna, interviewed_at, mem_id)
        VALUES ($1, NOW(), $2)
        RETURNING intr_idx
    """
    combined_psna = f"{persona} / {job} / {interviewType}"
    row = await conn.fetchrow(query, combined_psna, mem_id)
    await conn.close()
    return row["intr_idx"]

# @router.get("/db_test")
# async def db_test():
#     try:
#         conn = await get_db_connection()
#         result = await conn.fetch("SELECT 1")
#         await conn.close()
#         return {"messages":"DB 연결 성공!", "result": [dict(row) for row in result]}
#     except Exception as e:
#         return {"error": str}

@router.post("/save-detail")
async def save_detail(req: DetailInsertRequest):
    conn = await get_db_connection()
    try:
        print(f"💡 요청 데이터: intr_idx={req.intr_idx}, talk_person={req.talk_person}, talk_content={req.talk_content}")
        await conn.execute("""
            INSERT INTO tb_detail (intr_idx, talk_person, talk_content, talk_tm)
            VALUES ($1, $2, $3, NOW())
        """, req.intr_idx, req.talk_person, req.talk_content)
        await conn.close()
        return {"msg": "✅ detail 저장 완료"}
    except Exception as e:
        await conn.close()
        return {"error": str(e)}

@router.get("/debug/interview-check")
async def test_insert():
    try:
        conn = await get_db_connection()
        row = await conn.fetchrow("SELECT * FROM tb_interview LIMIT 1")
        await conn.close()
        if row is None:
            return {"message": "테이블은 존재하지만 데이터가 없습니다."}
        return {"sample_row": dict(row)}
    except Exception as e:
        return {"error": str(e)}

@router.post("/start")
async def start_interview(req: InterviewStartRequest):
    try:
        print("💡 요청 데이터:", req)
        session_id = await create_interview_session(
            persona=req.persona,
            job=req.job,
            interviewType=req.interviewType,
            mem_id=req.mem_id
        )
        print("✅ 세션 생성 완료:", session_id)
        return {"session_id": session_id}
    except Exception as e:
        print("❌ 예외 발생:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/interview")
async def interview(req: InterviewRequest):
    prompt = [
        {
            "role": "system",
              "content": (
                f"당신은 {req.persona}라는 성격의 면접관입니다. "
                f"직무는 {req.job}이고, 면접 유형은 {req.interviewType}입니다. "
                "면접관으로서 지원자에게 한 번에 하나씩 질문을 하세요."
                
                ),
              },
        *[msg.dict() for msg in req.messages]
    ]

    try:
        # OpenAI API 호출
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=prompt,
            temperature=0.7
        )

        reply = response.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
       return {"error": str(e)}
    
async def score_answer_with_ai(question: str, answer: str) -> int:
    prompt =f"""
        다음은 지원자와 면접관의 대화입니다.

        [질문]
        {question}

        [답변]
        {answer}

        [평가 기준]
        - 답변의 구체성, 명확성, 직무 관련성, 자신감 등을 종합적으로 고려하세요.
        - 0점부터 100점 사이로 매기세요. (1점 단위)
        - 점수만 숫자 하나로 출력하세요. (예: 87)

        점수를 부여하세요:
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )

        raw_score = response.choices[0].message.content.strip()
        score = int(raw_score)
    except Exception as e:
        print(f"score_answer_with_ai 실패: {e}")
        score = 70 # 혹시 이상한 값 나오면 기본 값
    return score

async def generate_final_feedback_with_ai(all_answers: List[str]) -> str:
    combined_answers = "\n\n".join(all_answers)

    prompt = f"""
        다음은 지원자의 모든 면접 답변입니다.

        [답변 모음]
        {combined_answers}

        [요청 사항]
        - 전반적인 답변 수준을 평가하고 최종 피드백을 작성하세요.
        - 지원자가 잘한 점과 개선할 점을 간결하고 명확하게 제시하세요.
        - 3~4줄 이내로 작성하세요.
        - 너무 부드럽거나 모호하지 않게, 구체적으로 작성하세요.

        최종 피드백을 작성하세요:
    """

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.4
    )

    final_feedback = response.choices[0].message.content.strip()
    return final_feedback

def generate_individual_feedback_with_ai(question: str, answer: str) -> str:
    prompt =f"""
        다음은 면접 질문과 이에 대한 지원자의 답변입니다. 이 답변에 대해 다음 기준에 따라 피드백을 작성하세요.

        - 어떤 점이 부족한지
        - 어떻게 개선할 수 있는지
        - 1~2 문장 이내, 단순한 표현은 피하고, 구체적이고 실질적인 조언을 제시하세요.

        [질문]
        {question}

        [답변]
        {answer}

        피드백:
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        print("GPT 응답 결과:", response)
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"generate_individual_feedback_with_ai 실패: {e}")
        return "답변은 비교적 성실했지만, 핵심 전달력이 다소 부족했습니다."

@router.get("/{session_id}/feedback", response_model=InterviewFeedbackData)
async def get_interview_feedback(session_id: str):
    try:
        conn = await get_db_connection()
        # 1. tb_detail 테이블에서 세션에 해당하는 질문/답변 목록 가져오기
        rows = await conn.fetch("""
                SELECT talk_person, talk_content
                FROM tb_detail
                WHERE intr_idx = $1
                ORDER BY talk_tm ASC
        """, int(session_id))

        print(f"session_id = {session_id} rows 개수 = {len(rows)}")
    except Exception as e:
        print(f"DB 조회 중 에러 발생: {e}")
        raise HTTPException(status_code=500, detail="DB 조회 실패")
    finally:
        await conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="세션에 해당하는 대화가 없습니다.")
    
    # 2. 질문-답변 쌍 구성
    questions_feedback = []
    current_question = None
    for row in rows:
        if row["talk_person"] == "interviewer":
            if "면접이 종료되었습니다" in row["talk_content"]:
                continue
            current_question = row["talk_content"]
        elif row["talk_person"] == "interviewee" and current_question:
            score = await score_answer_with_ai(current_question, row["talk_content"])
            feedback = generate_individual_feedback_with_ai(current_question, row["talk_content"])
            questions_feedback.append(
                QuestionFeedback(
                    question=current_question,
                    answer=row["talk_content"],
                    feedback=feedback,
                    score=score
                )
            )
            current_question = None # 질문-답변 짝 맞추고 나면 초기화

    if not questions_feedback:
        return InterviewFeedbackData(
            overallScore=0,
            scores={
                "clarity": 0,
                "relevance": 0,
                "confidence": 0,
                "professionalism": 0,
                "conciseness": 0,
            },
            questionFeedbacks=[],
            finalFeedback="답변 데이터가 부족하여 피드백을 생성할 수 없습니다."
        )
    
    all_answers = [q.answer for q in questions_feedback]
    final_feedback = await generate_final_feedback_with_ai(all_answers)
    overall_score = sum(q.score for q in questions_feedback) // len(questions_feedback)

    import random
    scores = {
        "clarity": min(100, max(0, overall_score + random.randint(-5, 5))),
        "relevance": min(100, max(0, overall_score + random.randint(-5, 5))),
        "confidence": min(100, max(0, overall_score + random.randint(-5, 5))),
        "professionalism": min(100, max(0, overall_score + random.randint(-5, 5))),
        "conciseness": min(100, max(0, overall_score + random.randint(-5, 5))),
    }

    # 3. 전체 피드백 데이터 구성
    return InterviewFeedbackData(
        overallScore=overall_score,
        scores=scores,
        questionFeedbacks=questions_feedback,
        finalFeedback=final_feedback
    )