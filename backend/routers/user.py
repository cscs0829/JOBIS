# routers/user.py (기존 코드에 추가 및 수정)
from fastapi import APIRouter, HTTPException, Path, Query # Path, Query 추가
from DB.Connection import get_db_connection
from datetime import datetime
from pydantic import BaseModel, Field # Field 추가

router = APIRouter()

# --- 기존 LoginRequest, SignupRequest 모델 ---
class LoginRequest(BaseModel):
    mem_id: str
    mem_pw: str

class SignupRequest(BaseModel):
    mem_id: str
    mem_pw: str
    mem_email: str
    mem_nick: str
    mem_gender: str
    mem_birthdate: str
    mem_addr: str
    mem_phone: str

# --- 회원 정보 수정용 JSON 형식 (수정) ---
# mem_id는 경로 파라미터로 받고, 비밀번호는 선택적으로 받도록 수정 가능
# 여기서는 요청 본문에 새 비밀번호(mem_pw)를 포함하는 것으로 가정
class UserUpdateRequest(BaseModel):
    mem_pw: str | None = Field(None, description="새 비밀번호 (변경 시에만 제공)") # 변경 시에만 값 전달
    mem_email: str
    mem_nick: str
    mem_addr: str
    mem_phone: str

# --- 기존 /login, /signup API ---
@router.post("/login")
async def login(data: LoginRequest):
    # ... (기존 로그인 로직) ...
    conn = await get_db_connection()
    user = await conn.fetchrow(
        "SELECT mem_id, mem_pw, mem_email, mem_nick FROM tb_member WHERE mem_id = $1 AND mem_pw = $2",
        data.mem_id, data.mem_pw
    )
    await conn.close()

    if user:
        return {
            "message": f"{user['mem_nick']}님 로그인 성공!",
            "mem_id": user['mem_id'],
            "mem_email": user['mem_email'],
            "mem_nick": user['mem_nick']
            # 필요한 다른 정보 추가 가능
        }
    else:
        raise HTTPException(status_code=401, detail="로그인 실패: 정보가 맞지 않습니다.")


@router.post("/signup")
async def signup(data: SignupRequest):
    # ... (기존 회원가입 로직) ...
    conn = await get_db_connection()

    existing_id = await conn.fetchrow("SELECT mem_id FROM tb_member WHERE mem_id = $1", data.mem_id)
    if existing_id:
        await conn.close()
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")

    existing_email = await conn.fetchrow("SELECT mem_id FROM tb_member WHERE mem_email = $1", data.mem_email)
    if existing_email:
        await conn.close()
        raise HTTPException(status_code=400, detail="이미 사용 중인 이메일입니다.")

    existing_nick = await conn.fetchrow("SELECT mem_id FROM tb_member WHERE mem_nick = $1", data.mem_nick)
    if existing_nick:
        await conn.close()
        raise HTTPException(status_code=400, detail="이미 사용 중인 닉네임입니다.")

    try:
        birthdate = datetime.strptime(data.mem_birthdate, "%Y-%m-%d").date()
    except ValueError:
        await conn.close()
        raise HTTPException(status_code=400, detail="생년월일 형식이 잘못되었습니다. (예: 1999-01-01)")

    await conn.execute(
        """
        INSERT INTO tb_member (
            mem_id, mem_pw, mem_email, mem_nick,
            mem_gender, mem_birthdate, mem_addr,
            mem_phone, joined_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        """,
        data.mem_id, data.mem_pw, data.mem_email, data.mem_nick,
        data.mem_gender, birthdate, data.mem_addr, data.mem_phone
    )

    await conn.close()
    return {
        "message": "회원가입 성공!",
        "mem_id": data.mem_id,
        "mem_email": data.mem_email,
        "mem_nick": data.mem_nick
    }

# ✅ 아이디 중복 확인 API 추가
@router.get("/check-id/{mem_id}")
async def check_id_duplicate(mem_id: str = Path(..., title="확인할 아이디")):
    conn = await get_db_connection()
    existing = await conn.fetchrow("SELECT mem_id FROM tb_member WHERE mem_id = $1", mem_id)
    await conn.close()
    if existing:
        raise HTTPException(status_code=409, detail="이미 사용 중인 아이디입니다.") # 409 Conflict
    return {"message": "사용 가능한 아이디입니다."}

# ✅ 이메일 중복 확인 API 추가
@router.get("/check-email/{mem_email}")
async def check_email_duplicate(mem_email: str = Path(..., title="확인할 이메일")):
    conn = await get_db_connection()
    existing = await conn.fetchrow("SELECT mem_id FROM tb_member WHERE mem_email = $1", mem_email)
    await conn.close()
    if existing:
        raise HTTPException(status_code=409, detail="이미 사용 중인 이메일입니다.")
    return {"message": "사용 가능한 이메일입니다."}

# ✅ 닉네임 중복 확인 API 추가
@router.get("/check-nickname/{mem_nick}")
async def check_nickname_duplicate(mem_nick: str = Path(..., title="확인할 닉네임")):
    conn = await get_db_connection()
    existing = await conn.fetchrow("SELECT mem_id FROM tb_member WHERE mem_nick = $1", mem_nick)
    await conn.close()
    if existing:
        raise HTTPException(status_code=409, detail="이미 사용 중인 닉네임입니다.")
    return {"message": "사용 가능한 닉네임입니다."}


# ✅ 회원 정보 수정 API (수정)
# PUT 메서드 사용, URL에 mem_id 포함
@router.put("/update/{mem_id}")
async def update_user(data: UserUpdateRequest, mem_id: str = Path(..., title="수정할 회원 ID")):
    conn = await get_db_connection()

    # 사용자 존재 확인
    user = await conn.fetchrow("SELECT mem_id FROM tb_member WHERE mem_id = $1", mem_id)
    if not user:
        await conn.close()
        raise HTTPException(status_code=404, detail="해당 사용자가 존재하지 않습니다.")

    # 업데이트할 필드와 값 동적 구성 (비밀번호는 있을 때만 업데이트)
    update_fields = []
    update_values = []
    current_param_index = 1 # 파라미터 인덱스

    # 이메일, 닉네임 중복 확인 (선택 사항 - 수정 시에도 필요하다면)
    # ... (닉네임, 이메일 중복 검사 로직 추가 - 단, 자기 자신은 제외해야 함) ...

    # 기본 정보 업데이트 필드 추가
    update_fields.extend(["mem_nick = ${}".format(current_param_index),
                          "mem_email = ${}".format(current_param_index + 1),
                          "mem_phone = ${}".format(current_param_index + 2),
                          "mem_addr = ${}".format(current_param_index + 3)])
    update_values.extend([data.mem_nick, data.mem_email, data.mem_phone, data.mem_addr])
    current_param_index += 4

    # 비밀번호 업데이트 (요청 본문에 mem_pw가 있을 경우)
    if data.mem_pw:
        update_fields.append("mem_pw = ${}".format(current_param_index))
        update_values.append(data.mem_pw) # 새 비밀번호
        current_param_index += 1

    if not update_fields:
        await conn.close()
        raise HTTPException(status_code=400, detail="수정할 정보가 없습니다.")

    # 최종 WHERE 절 파라미터 추가
    update_values.append(mem_id)

    # SQL 쿼리 생성 및 실행
    query = f"""
        UPDATE tb_member
        SET {', '.join(update_fields)}
        WHERE mem_id = ${current_param_index}
    """

    await conn.execute(query, *update_values)

    await conn.close()
    return {"message": "회원 정보 수정 완료"}