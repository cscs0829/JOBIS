# Routers/interview.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv # load_dotenv로 .env 파일에 api 키 가져옴
import asyncpg
from DB.Connection import get_db_connection

load_dotenv()

router = APIRouter(tags=["interview"])

openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class DetailInsertRequest(BaseModel):
    intr_idx: int
    talk_person: str
    talk_content: str

# Pydantic 모델
class InterviewStartRequest(BaseModel):
    persona: str
    job: str
    interviewType:str
    mem_id: str

class Message(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    persona: str
    job: str
    interviewType: str
    selectedMode: str
    messages: list[Message]

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