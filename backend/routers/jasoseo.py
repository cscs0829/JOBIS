# backend_fastapi/routers/jasoseo.py

from fastapi import APIRouter, Request
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# 🔸 Pydantic 모델 정의 (프론트에서 받는 데이터 구조와 동일하게)
class JasoseoInput(BaseModel):
    field: str
    company: str
    qualifications: str
    projects: str
    experiences: str
    major: str
    emphasisPoints: str

# 🔸 OpenAI 인스턴스
openai = OpenAI(api_key=os.getenv("OPENAI_API"))

# 🔸 라우터 구현
@router.post("/generate-draft")
async def generate_draft(input: JasoseoInput):
    prompt = f"""
    아래 정보를 바탕으로 자기소개서 초안을 작성해줘:

    1. 지원 분야: {input.field}
    2. 지원 회사: {input.company}
    3. 자격증: {input.qualifications}
    4. 프로젝트 경험: {input.projects}
    5. 특별한 경험: {input.experiences}
    6. 전공: {input.major}
    7. 강조 포인트: {input.emphasisPoints}

    불필요한 문장과 단어의 반복은 하지말 것
    문장은 진정성 있고 사람이 작성한 것처럼 자연스럽게 작성할 것
    구체적인 예시나 경험 중심으로 작성할 것
    """

    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        draft = response.choices[0].message.content.strip()
        return {"draft": draft}
    except Exception as e:
        return {"error": str(e)}
