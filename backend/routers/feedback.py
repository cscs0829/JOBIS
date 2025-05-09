from fastapi import APIRouter, Form, HTTPException, Query
from DB.Connection import get_db_connection
from openai import OpenAI
import os

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # ✅ 유지


@router.post("/feedback/generate")
async def generate_feedback(
    mem_id: str = Form(...),
    field: str = Form(...),
    selected_feedback_types: str = Form(...),
    other_feedback_type: str = Form("")
):
    try:
        # ✅ 자기소개서 불러오기
        conn = await get_db_connection()
        row = await conn.fetchrow("SELECT self_intro_raw_text FROM tb_attached WHERE mem_id = $1", mem_id)
        await conn.close()

        if not row or not row["self_intro_raw_text"]:
            raise HTTPException(status_code=404, detail="자기소개서가 존재하지 않습니다.")

        self_intro = row["self_intro_raw_text"]

        # ✅ 프롬프트 작성
        prompt = f"""
너는 채용담당자이자 글쓰기 첨삭 전문가야.
지원자의 자기소개서를 분석하고, 요청한 피드백 항목에 대해 구체적인 첨삭 조언을 제공해줘.

[지원 분야]
{field}

[자기소개서 본문]
{self_intro}

[요청한 피드백 종류]
- {selected_feedback_types}

[기타 요청사항]
{other_feedback_type}

[사용자가 피드백 종류를 골랐을 경우(기타 요청사항)]
위 정보를 참고해서 전체 자기소개서를 평가해줘.
사용자가 피드백 종류를 골랐으면 해당 피드백 종류에 대해서만 평가해줘!
피드백 종류로 고른 것들만(기타 입력한 피드백 종류도 포함) 평가해줘! 나머지 항목 안해도 돼
피드백은 항목별로 나눠서 현실적이고, 문장 표현, 구성, 설득력 등 실질적인 조언을 해줘.
중복 표현, 문법 문제도 자세하게 언급해줘.
마지막엔 AI 점수 또는 등급 제공해줘(예: "B+" 등급 / "총점 84점" / "상위 20% 표현력")

[피드백 작성 규칙]
- 사용자가 선택한 피드백 항목(selected_feedback_types, other_feedback_type)이 하나라도 있으면,
  → 선택한 항목에 대해서만 피드백을 작성한다.
- 사용자가 선택한 항목이 아무것도 없으면,
  → 아래 5개 항목(문장 표현력, 논리 흐름, 직무 적합성, 맞춤형 예시, AI 점수/등급) 기준으로 평가한다.
- 두 경우 모두, 선택하지 않은 항목에 대해 추가 피드백을 작성하지 않는다.
- 절대 5개 기본항목을 중복하여 작성하지 않는다

1. 문장 표현력 피드백
“이 문장은 너무 모호하거나 두루뭉술합니다. 구체적인 경험을 중심으로 다시 작성해보세요.”

✔ 장문 or 두루뭉술한 표현 → 명확하게 제안

✔ 문법 오류, 비문 체크

✔ 자주 반복되는 단어 → 다양하게 바꿀 수 있도록 제시

2. 구조 및 논리 흐름 피드백
“강점-경험-지원동기-포부 순으로 자연스럽게 이어지도록 구성해보세요.”

✔ 글의 전개가 논리적인지 체크

✔ 항목 누락 여부: 강점/지원동기/직무이해 등

✔ 개요와 결론의 연결성 체크

3. 직무 적합성 분석
“지원하신 직무에 비해 기술 강조가 부족해 보입니다.”

✔ 사용자가 입력한 지원직무와 내용 비교

✔ 해당 직무에서 자주 요구하는 키워드와 비교

✔ 부족한 내용은 추가 가이드 제공

4. 맞춤형 개선 예시 제안
“이렇게 바꾸면 더 자연스럽고 명확한 표현이 됩니다.”

원문: “저는 책임감이 강한 사람입니다.”

개선문: “대외활동 중 팀장 역할을 맡으며 일정 관리를 책임졌습니다.”

✔ AI가 글을 점수화 → 사용자 동기 부여

✔ 각 항목(논리성, 직무 적합성, 표현력 등) 세부 점수 제공

5. AI 점수 또는 등급 제공 (선택 기능)
예: "B+" 등급 / "총점 84점" / "상위 20% 표현력"

"""

        print("🧠 GPT 프롬프트:\n", prompt[:300], "...")

        # ✅ GPT-4 호출
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000
        )

        return {"feedback": completion.choices[0].message.content}

    except Exception as e:
        print("❌ 피드백 생성 중 오류:", str(e))
        raise HTTPException(status_code=500, detail="AI 피드백 생성 실패")
    
@router.get("/feedback/load")  # 프론트 요청 URL에 맞춰야 함!
async def load_self_intro(mem_id: str = Query(...)):
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow("""
            SELECT self_intro_raw_text
            FROM tb_attached
            WHERE mem_id = $1
        """, mem_id)

        if not row or not row["self_intro_raw_text"]:
            raise HTTPException(status_code=404, detail="자기소개서가 없습니다.")

        return { "self_intro_text": row["self_intro_raw_text"] }
    finally:
        await conn.close()    
