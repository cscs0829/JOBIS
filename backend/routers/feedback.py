# routers/feedback.py
from fastapi import APIRouter, UploadFile, Form, File
from fastapi.responses import JSONResponse
from openai import OpenAI
import os

router = APIRouter()

# OpenAI 인스턴스
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # .env 필요 시

@router.post("/feedback/generate")
async def generate_feedback(
    mem_id: str = Form(...),
    field: str = Form(...),
    company: str = Form(...),
    emphasisPoints: str = Form(...),
    requirements: str = Form(...),
    resume: UploadFile = File(...)
):
    try:
        # 자소서 본문 추출
        resume_content = await resume.read()
        resume_text = resume_content.decode("utf-8", errors="ignore")  # txt 또는 PDF 처리 방식 분기 가능

        # 프롬프트 구성
        prompt = f"""
너는 AI 자기소개서 컨설턴트야. 아래 자소서를 보고 피드백을 작성해줘.

[지원 분야]: {field}
[지원 회사]: {company}
[강조 포인트]: {emphasisPoints}
[사용자 요구사항]: {requirements}

[자기소개서 원문]:
{resume_text}

각 항목에 대해 구체적인 개선 포인트, 문장 수정 제안, 어조 및 구성 추천을 포함해줘.\
만약 사용자가 따로 요청한 사항이 있다면 그에 맞춰서 피드백을 작성해줘.
아래가 예시야

✅ 1. 문장 표현력 피드백
“이 문장은 너무 모호하거나 두루뭉술합니다. 구체적인 경험을 중심으로 다시 작성해보세요.”

✔ 장문 or 두루뭉술한 표현 → 명확하게 제안

✔ 문법 오류, 비문 체크

✔ 자주 반복되는 단어 → 다양하게 바꿀 수 있도록 제시

✅ 2. 구조 및 논리 흐름 피드백
“강점-경험-지원동기-포부 순으로 자연스럽게 이어지도록 구성해보세요.”

✔ 글의 전개가 논리적인지 체크

✔ 항목 누락 여부: 강점/지원동기/직무이해 등

✔ 개요와 결론의 연결성 체크

✅ 3. 직무 적합성 분석
“지원하신 직무에 비해 기술 강조가 부족해 보입니다.”

✔ 사용자가 입력한 지원직무와 내용 비교

✔ 해당 직무에서 자주 요구하는 키워드와 비교

✔ 부족한 내용은 추가 가이드 제공

✅ 4. AI 점수 또는 등급 제공 (선택 기능)
예: "B+" 등급 / "총점 84점" / "상위 20% 표현력"

✔ AI가 글을 점수화 → 사용자 동기 부여

✔ 각 항목(논리성, 직무 적합성, 표현력 등) 세부 점수 제공

✅ 5. 맞춤형 개선 예시 제안
“이렇게 바꾸면 더 자연스럽고 명확한 표현이 됩니다.”

원문: “저는 책임감이 강한 사람입니다.”

개선문: “대외활동 중 팀장 역할을 맡으며 일정 관리를 책임졌습니다.”

위 내용을 기반으로 자기소개서 피드백을 작성해줘. 포인트별로 항목 나눠서 명확하게 작성해줘.

"""

        # OpenAI API 호출
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000
        )

        ai_result = response.choices[0].message.content.strip()
        return {"feedback": ai_result}

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})