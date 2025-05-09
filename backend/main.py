from fastapi import FastAPI # 웹 서버 생성용 클래스
from routers import tts, interview, user, jasoseo, guide, recommend, upload, feedback, mentor  # ✅ 정상 import / 로그인/면접 기능 따로 나눈 파일
from fastapi.middleware.cors import CORSMiddleware # 포트 번호 다른 리엑트 서버랑 연결
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv


load_dotenv()  # ✅ .env 환경변수 로드

app = FastAPI( # 서버를 만든다
    docs_url="/swagger",  # /docs 대신 Swagger 에 문서 URL 생성(프론트 포트랑 충돌 방지)
    redoc_url="/redoc",   # 혹시 다른 스타일 문서페이지
    openapi_url="/openapi.json"   # API 명세 주소 유지
)

# 라우터 등록 메인이랑 연결
app.include_router(user.router, prefix="/user")
app.include_router(interview.router, prefix="/interview")
app.include_router(jasoseo.router, prefix="/jasoseo")
app.include_router(guide.router, prefix="/guide")
app.include_router(recommend.router, prefix="/recommend")
app.include_router(upload.router)
app.include_router(tts.router)
app.include_router(feedback.router)  
app.include_router(mentor.router) 

# "/audio" 경로로 접속하면 audio 폴더 내의 정적(mp3) 파일을 제공 4/23 추가
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# CORS 다른 프론트 포트 번호일 때 API 요청 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # React 서버 주소/일단은 전부 허용으로
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "FastAPI 백엔드 서버 연결 완료!"}
# uvicorn main:app --reload --port 9000 벡엔드 서버 실행from fastapi import FastAPI # 웹 서버 생성용 클래스
from routers import tts, interview, user, jasoseo, guide, recommend, upload, feedback  # ✅ 정상 import / 로그인/면접 기능 따로 나눈 파일
from fastapi.middleware.cors import CORSMiddleware # 포트 번호 다른 리엑트 서버랑 연결
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv


load_dotenv()  # ✅ .env 환경변수 로드

app = FastAPI( # 서버를 만든다
    docs_url="/swagger",  # /docs 대신 Swagger 에 문서 URL 생성(프론트 포트랑 충돌 방지)
    redoc_url="/redoc",   # 혹시 다른 스타일 문서페이지
    openapi_url="/openapi.json"   # API 명세 주소 유지
)

# 라우터 등록 메인이랑 연결
app.include_router(user.router, prefix="/user")
app.include_router(interview.router, prefix="/interview")
app.include_router(jasoseo.router, prefix="/jasoseo")
app.include_router(guide.router, prefix="/guide")
app.include_router(recommend.router, prefix="/recommend")
app.include_router(upload.router)
app.include_router(tts.router)
app.include_router(feedback.router)  # ✅ 이 줄이 있어야 함
app.include_router(mentor.router) 

# "/audio" 경로로 접속하면 audio 폴더 내의 정적(mp3) 파일을 제공 4/23 추가
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# CORS 다른 프론트 포트 번호일 때 API 요청 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # React 서버 주소/일단은 전부 허용으로
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "FastAPI 백엔드 서버 연결 완료!"}
# uvicorn main:app --reload --port 9000 벡엔드 서버 실행