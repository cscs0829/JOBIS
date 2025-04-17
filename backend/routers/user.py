from fastapi import APIRouter, HTTPException
from DB.Connection import get_db_connection
from pydantic import BaseModel
from datetime import datetime
from typing import Literal

router = APIRouter()

# 로그인용 JSON 형식
class LoginRequest(BaseModel):
    mem_id: str
    mem_pw: str

# ✅ 로그인 API
@router.post("/login")
async def login(data: LoginRequest):
    conn = await get_db_connection()

    user = await conn.fetchrow(
        "SELECT * FROM tb_member WHERE mem_id = $1 AND mem_pw = $2", data.mem_id, data.mem_pw
    )

    await conn.close()

    if user:
        return {
            "message": f"{user['mem_nick']}님 로그인 성공!",
            "mem_id": user['mem_id'],
            "mem_email": user['mem_email'],
            "mem_nick": user['mem_nick']
        }
    else:
        raise HTTPException(status_code=401, detail="로그인 실패: 정보가 맞지 않습니다.")


# 회원가입용 JSON 형식
class SignupRequest(BaseModel):
    mem_pw: str
    mem_email: str
    mem_nick: str
    mem_gender: str
    mem_birthdate: str  # YYYY-MM-DD 문자열로 받음
    mem_addr: str
    mem_phone: str

# ✅ 회원가입 API
@router.post("/signup")
async def signup(data: SignupRequest):
    conn = await get_db_connection()

    # 이메일을 ID로 사용
    existing = await conn.fetchrow(
        "SELECT mem_id FROM tb_member WHERE mem_id = $1", data.mem_email
    )
    if existing:
        await conn.close()
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")

    # 🔥 문자열 생일 → date 타입으로 변환
    try:
        birthdate = datetime.strptime(data.mem_birthdate, "%Y-%m-%d").date()
    except ValueError:
        await conn.close()
        raise HTTPException(status_code=400, detail="생년월일 형식이 잘못되었습니다. (예: 1999-01-01)")

    # INSERT
    await conn.execute(
        """
        INSERT INTO tb_member (
            mem_id, mem_pw, mem_email, mem_nick,
            mem_gender, mem_birthdate, mem_addr,
            mem_phone, joined_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        """,
        data.mem_email,  # mem_id 자리에 email 사용
        data.mem_pw,
        data.mem_email,
        data.mem_nick,
        data.mem_gender,
        birthdate,
        data.mem_addr,
        data.mem_phone
    )

    await conn.close()
    return {
        "message": "회원가입 성공!",
        "mem_id": data.mem_email,
        "mem_email": data.mem_email,
        "mem_nick": data.mem_nick
    }
