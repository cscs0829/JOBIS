from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from DB.Connection import get_db_connection
from datetime import datetime
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

# ✅ OpenAI 인스턴스
openai = OpenAI(api_key=os.getenv("OPENAI_API"))

# ✅ 자기소개서 초안 생성 및 DB 저장 API
@router.post("/generate-draft")
async def generate_and_save_draft(
    mem_id: str = Form(...),
    questions: str = Form(...),
    skills: str = Form(...),
    field: str = Form(...),
    company: str = Form(...),
    emphasisPoints: str = Form(...),
    resume: UploadFile = File(None),
    portfolio: UploadFile = File(None),
):
    print("📥 [generate-draft 요청 도착]")
    print("📌 mem_id:", mem_id)
    print("📌 questions:", questions)
    print("📌 skills:", skills)
    print("📌 field:", field)
    print("📌 company:", company)
    print("📌 emphasisPoints:", emphasisPoints)
    # ✅ 프롬프트 구성
    prompt = f"""
    다음 정보를 기반으로 AI 자기소개서 초안을 작성해줘:

    - 자소서 질문: {questions}
    - 보유 스킬: {skills}
    - 지원 분야: {field}
    - 지원 회사: {company}
    - 강조 포인트: {emphasisPoints}

    [작성 조건]
    - '네 알겠습니다'와 같이 대답하지 말고 바로 작성
    - 사용자가 입력한 자소서 질문에 대한 답변을 작성
    - 질문항목에 대한 작성의 시작은 항상 질문 보여주고 [소제목]을 붙이고 개행처리 한 다음 내용작성
    - 여기서 [소제목]은 답변의 주제를 나타내는 제목인데 면접관이 봤을 때 이목을 끌 수 있고 재치있는 제목으로 작성
    - [소제목]은 20자 이내로 작성 
    - 자기소개서의 각 항목은 최소 300자~최대1000자 이상 작성
    - 구체적인 예시와 진정성 있는 문장으로 구성
    - 중복 표현 피하기
    - 문장은 자연스럽게, 사람처럼 작성
    """

    try:
        # ✅ OpenAI GPT 호출
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        draft = response.choices[0].message.content.strip()

    except Exception as e:
        print("🔥 GPT 생성 오류:", e)
        raise HTTPException(status_code=500, detail=f"AI 초안 생성 실패: {str(e)}")

    try:
        # ✅ PostgreSQL 저장
        conn = await get_db_connection()

        intro_keyword = f"{questions}, {skills}, {field}, {company}, {emphasisPoints}"
        
        await conn.execute(
            """
            INSERT INTO tb_self_introduction 
            (mem_id, file_idx, intro_type, intro_keyword, ai_introduction, created_at)
            VALUES ($1, NULL, $2, $3, $4, NOW())
            """,
            mem_id,
            'A',
            intro_keyword,
            draft
        )

        await conn.close()

    except Exception as db_error:
        print("🔥 DB 저장 오류:", db_error)
        raise HTTPException(status_code=500, detail=f"DB 저장 실패: {str(db_error)}")

    return {
        "message": "자기소개서 초안 생성 및 저장 완료",
        "draft": draft
    }
