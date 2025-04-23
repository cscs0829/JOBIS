from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from DB.Connection import get_db_connection
from datetime import datetime
from openai import OpenAI
import os
from dotenv import load_dotenv
import fitz  # PyMuPDF


load_dotenv()
router = APIRouter()

# ✅ OpenAI 인스턴스
openai = OpenAI(api_key=os.getenv("OPENAI_API"))

# ✅ PDF 텍스트 추출 함수
async def extract_pdf_text(upload_file: UploadFile) -> str:
    if upload_file is None:
        return ""
    try:
        contents = await upload_file.read()
        pdf = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in pdf:
            text += page.get_text()
        return text.strip()
    except Exception as e:
        print(f"PDF 파싱 오류: {upload_file.filename} - {e}")
        return ""

# ✅ PDF 텍스트 조건부 삽입 함수
def format_if_exists(title: str, text: str) -> str:
    return f"\n\n[{title}]\n{text.strip()}" if text.strip() else ""

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
    cv: UploadFile = File(None)
):
    print("📎 업로드된 cv 파일명:", cv.filename if cv else "None")
    print("📎 업로드된 resume 파일명:", resume.filename if resume else "None")
    print("📎 업로드된 portfolio 파일명:", portfolio.filename if portfolio else "None")
    print("📥 [generate-draft 요청 도착]")
    print("📌 mem_id:", mem_id)
    print("📌 questions:", questions)
    print("📌 skills:", skills)
    print("📌 field:", field)
    print("📌 company:", company)
    print("📌 emphasisPoints:", emphasisPoints)

    # ✅ PDF 텍스트 추출
    print("📄 [CV 추출 시작]")
    cv_text = await extract_pdf_text(cv)
    print("📄 [CV 추출 완료]")

    print("📄 [Resume 추출 시작]")
    resume_text = await extract_pdf_text(resume)
    print("📄 [Resume 추출 완료]")

    print("📄 [Portfolio 추출 시작]")
    portfolio_text = await extract_pdf_text(portfolio)
    print("📄 [Portfolio 추출 완료]")

    print("📑 이력서 내용:", cv_text[:300])
    print("📑 자기소개서 내용:", resume_text[:300])
    print("📑 포트폴리오 내용:", portfolio_text[:300]) 

    # ✅ 프롬프트 구성
    prompt = f"""
    너는 전문 HR 담당자이자 채용담당 AI야.
    지금부터 너에게 전달하는 정보는 지원자가 입력한 자기소개서 항목들과 직접 작성했던 PDF 기반 서류들(이력서, 자기소개서, 포트폴리오)이야.

    ### 1. 사용자가 직접 입력한 정보
    - 자소서 질문: {questions}
    - 보유 스킬: {skills}
    - 지원 분야: {field}
    - 지원 회사: {company}
    - 강조 포인트: {emphasisPoints}

    이 항목은 자소서의 핵심 소재가 되어야 하며, 모든 질문 항목에 반드시 반영되어야 한다.

    ### 2. 첨부된 PDF 파일 내용 요약 및 반영 (직접 작성한 서류임)
    다음 내용은 지원자가 실제 작성한 문서에서 추출된 텍스트다. 아래 내용을 기반으로 작성하되, **내용을 그대로 복붙하지 말고 핵심 키워드, 문장 흐름, 표현 방식만 자연스럽게 차용해**.
    만일 첨부된 파일이 없으면 사용자가 입력한 정보를 기반으로 작성해.
    """

    prompt += format_if_exists("📄 이력서 요약 (cv_text)", cv_text)
    prompt += format_if_exists("📄 자기소개서 요약 (resume_text)", resume_text)
    prompt += format_if_exists("📄 포트폴리오 요약 (portfolio_text)", portfolio_text)

    prompt += """
    [작성 조건]
    - '네 알겠습니다'와 같이 대답하지 말고 바로 작성
    - 사용자가 입력한 자소서 질문에 대한 답변을 작성
    - 질문항목에 대한 작성의 시작은 항상 질문 보여주고 [소제목]을 붙이고 개행처리 한 다음 내용작성
    - 여기서 [소제목]은 답변의 주제를 나타내는 제목인데 면접관이 봤을 때 이목을 끌 수 있고 재치있는 제목으로 작성
    - [소제목]은 20자 이내로 작성 
    - 자기소개서의 각 항목은 최소 500자이상 꼭 작성이 되어야하고 최대 1000자 이내로 작성이 되어야 함
    - 사용자가 만약 강조 포인트에 글자 수를 적었으면 그 글자 수를 꼭 지켜야 함
    - 사용자가 만약 강조 포인트에 문장 수를 적었으면 그 문장 수를 꼭 지켜야 함
    - 사용자가 만약 강조 포인트에 문단 수를 적었으면 그 문단 수를 꼭 지켜야 함
    - 구체적인 예시와 진정성 있는 문장으로 구성
    - 중복 표현 피하기
    - 문장은 자연스럽게, 사람처럼 작성
    - 문장 길이 조절 (너무 길거나 짧지 않게)
    - 문법 및 맞춤법 체크
    - 구체적인 예시 포함
    - 진정성 있는 문장으로 구성
    - 문장 부호 및 띄어쓰기 체크
    - gpt처럼 말고 사람처럼 자연스럽게 작성
    - 문장 길이 조절 (너무 길거나 짧지 않게)
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
