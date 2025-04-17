# Routers/interview.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv # load_dotenv로 .env 파일에 api 키 가져옴

load_dotenv()

router = APIRouter(tags=["interview"])

openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Message(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    persona: str
    job: str
    interviewType: str
    selectedMode: str
    messages: list[Message]

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