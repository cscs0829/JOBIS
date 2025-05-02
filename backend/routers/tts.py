from fastapi import APIRouter, Request # FastAPI 라우터 생성과 요청 정보 읽기 위함
from fastapi.responses import FileResponse, JSONResponse # 파일 응답 반환을 위한 모듈
from gtts import gTTS # Google Text to Speech 모듈
import uuid # 고유한 파일명을 만들기 위한 uuid 모듈
import os # 파일 시스템 경로 조작을 위한 모듈

# API 라우터 객체 생성
router = APIRouter()

# POST 요청을 받는 TTS 생성 API 정의
@router.post("/tts")
async def generate_tts(request: Request):
    # 요청으로부터 JSON 데이터(body)를 파싱해서 읽어옴
    data = await request.json()

    # JSON에서 "text"라는 key에 해당하는 값을 가져옴 (없으면 기본값 "")
    text = data.get("text", "").strip()

    if not text:
        return JSONResponse(status_code=400, content={"error": "No text to speak"})

    # 고유한 mp3 파일명들 생성
    filename = f"tts_{uuid.uuid4().hex}.mp3"

    # 저장할 파일의 전체 경로 지정 (audio 폴더 하위에 저장)
    filepath = f"audio/{filename}"

    # gTTS 객체를 생성(언어: 한국어 'ko', 변환할 텍스트: text)
    try:

        tts = gTTS(text=text, lang='ko')

        # 지정된 경로에 mp3 파일로 저장
        tts.save(filepath)

        # 클라이언트에게 해당 음성 파일의 URL을 반환
        return{"audio_url": f"/audio/{filename}"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/tts/delete")
async def delete_audio(request: Request):
    data = await request.json()
    filename = data.get("filename")

    filepath = f"audio/${filename}"
    if os.path.exists(filepath):
        os.remove(filepath)
        return JSONResponse(content={"result": "success", "message": f"{filename} deleted"})
    else:
        return JSONResponse(content={"result": "error", "message": "file not found"}, status_code=404)