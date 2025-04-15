# Routers/interview.py
from fastapi import APIRouter, Request
from dotenv import load_dotenv # load_dotenv로 .env 파일에 api 키 가져옴
import openai
import os

router = APIRouter()

# load_dotenv()
# openai.api_key = os.getenv("OPENAI_API_KEY")


@router.get("/")
def test():
    return {"message": "인터뷰 라우터 테스트"}