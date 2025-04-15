# main.py
from fastapi import FastAPI # 웹 서버 생성용 클래스
from routers import user, interview # 로그인/면접 기능 따로 나눈 파일
from fastapi.middleware.cors import CORSMiddleware # 포트 번호 다른 리엑트 서버랑 연결

app = FastAPI( # 서버를 만든다
    docs_url="/swagger",  # /docs 대신 Swagger 에 문서 URL 생성(프론트 포트랑 충돌 방지)
    redoc_url="/redoc",   # 혹시 다른 스타일 문서페이지
    openapi_url="/openapi.json"  # API 명세 주소 유지
)

# 라우터 등록 메인이랑 연결
app.include_router(user.router, prefix="/user") 
app.include_router(interview.router, prefix="/interview")

# CORS 다른 프론트 포트 번호일 때 API 요청 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React 서버 주소/일단은 전부 허용으로
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "FastAPI 백엔드 서버 연결 완료!"}
# uvicorn main:app --reload --port 9000 벡엔드 서버 실행

