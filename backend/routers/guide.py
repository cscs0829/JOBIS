from fastapi import APIRouter, UploadFile, Form, HTTPException
from services.guide_service import generate_ai_guide
from utils.pdf_reader import pdf_to_text  # 유틸 함수 불러오기

router = APIRouter()

@router.post("/guide")
async def guide(
    mem_id: str = Form(...),
    job_position: str = Form(...),
    dream_company: str = Form(...),
    strong_point: str = Form(...),
    career_level: str = Form(...),
    self_intro: UploadFile = None,
    portfolio: UploadFile = None,
    self_intro_text: str = Form(""),       # 텍스트 복붙용
    portfolio_text: str = Form("")         # 텍스트 복붙용
):
    async def extract_text(file: UploadFile) -> str:
        try:
            if file is None:
                return ""

            # ✅ .pdf만 허용
            if not file.filename.endswith(".pdf"):
                raise HTTPException(
                    status_code=400,
                    detail="❗ .pdf 파일만 업로드할 수 있습니다."
                )

            content = await file.read()
            return pdf_to_text(content)

        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ 파일 처리 오류: {e}")
            raise HTTPException(
                status_code=500,
                detail="[파일을 읽는 중 오류 발생]"
            )

    try:
        # ✅ 파일 있으면 파일에서 추출, 없으면 복붙 텍스트 사용
        extracted_self_intro = await extract_text(self_intro) if self_intro else self_intro_text
        extracted_portfolio = await extract_text(portfolio) if portfolio else portfolio_text

        # AI 생성 실행(서비스 함수 호출)
        result = await generate_ai_guide(
            mem_id, job_position, dream_company, strong_point, career_level,
            extracted_self_intro, extracted_portfolio
        )
        return {"ai_result": result}

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"❌ 전체 guide 처리 중 오류: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"서버 처리 중 오류 발생: {str(e)}"
        )