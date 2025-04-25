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

위 정보를 참고해서 전체 자기소개서를 평가해줘.
피드백은 항목별로 나눠서 현실적이고, 문장 표현, 구성, 설득력 등 실질적인 조언을 해줘.
중복 표현, 문법 문제도 간단히 언급해줘.
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
