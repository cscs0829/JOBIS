import os
import traceback
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from openai import OpenAI
from dotenv import load_dotenv
import uuid

load_dotenv()
router = APIRouter(tags=["voice"])
openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    temp_filename = f"temp_{uuid.uuid4().hex}.wav"

    try:
        print("📎 업로드된 파일 이름:", audio.filename)
        print("📎 콘텐츠 타입:", audio.content_type)

        # 1. .wav 파일로 저장
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)

        if not os.path.exists(temp_filename):
            raise HTTPException(status_code=500, detail="입력 파일 저장 실패")

        print(f" 저장 완료: {temp_filename}")

        # 2. Whisper API 호출
        with open(temp_filename, "rb") as f:
            result = openai.audio.transcriptions.create(
                model="whisper-1",
                file=f,
                response_format="text",
                language="ko"
            )

        return {"text": result}
    
    except Exception as e:
        print("STT 처리 실패:", e)
        raise HTTPException(status_code=500, detail=f"STT 처리 실패: {str(e)}")
    
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
