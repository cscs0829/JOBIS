import os
from datetime import datetime
import fitz
from fastapi import UploadFile
from DB.Connection import get_db_connection

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_uploaded_file_and_extract_text(mem_id: str, file_type: str, file: UploadFile):
    print("🚀 업로드 요청 도착")
    print(f"📌 mem_id: {mem_id}, file_type: {file_type}")
    
    # 1. 파일 저장 경로 정의
    filename = f"{file_type}_{mem_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # 2. 파일 저장
    try:
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        print(f"✅ 파일 저장 완료: {file_path}")
    except Exception as e:
        print(f"❌ 파일 저장 실패: {str(e)}")
        return {"status": "fail", "reason": "file_save_error"}
    
    # 3. 텍스트 추출
    try:
        doc = fitz.open(file_path)
        text = "\n".join([page.get_text() for page in doc])
        print(f"📝 텍스트 추출 완료 (길이 {len(text)}): {text[:100]}...")
    except Exception as e:
        print(f"❌ 텍스트 추출 실패: {str(e)}")
        return {"status": "fail", "reason": "text_extract_error"}
    
    # 4. DB 저장
    column_map = {
        "resume": ("resume", "resume_raw_text"),
        "self_intro": ("self_introduction", "self_intro_raw_text"),
        "portfolio": ("portfolio", "portfolio_raw_text")
    }

    if file_type not in column_map:
        print(f"❌ 유효하지 않은 file_type: {file_type}")
        return {"status": "fail", "reason": "invalid_file_type"}
    
    file_col, text_col = column_map[file_type]

    try:
        conn = await get_db_connection()

        # 1. 해당 mem_id row 있는지 확인
        row = await conn.fetchrow("SELECT * FROM tb_attached WHERE mem_id = $1", mem_id)
        if not row:
            await conn.execute("""
                INSERT INTO tb_attached (mem_id, created_at, updated_at)
                VALUES ($1, NOW(), NOW())
            """, mem_id)
            print(f"🆕 mem_id '{mem_id}' 에 대한 새로운 row 삽입됨")

        # 2. 컬럼명 f-string으로 동적으로 삽입
        update_query = f"""
            UPDATE tb_attached
            SET {file_col} = $1, {text_col} = $2, updated_at = NOW()
            WHERE mem_id = $3
        """

        result = await conn.execute(update_query, file_path, text, mem_id)
        await conn.close()

        print(f"✅ DB 저장 완료 result: {result}")
        return {"status": "success", "path": file_path, "preview": text[:100]}
    except Exception as e:
        print(f"❌ DB 저장 실패: {str(e)}")
    return {"status": "fail", "reason": "db_error"}