import os
from datetime import datetime
from fastapi import UploadFile
from DB.Connection import get_db_connection

# ✅ 추가된 import
from unstructured.partition.pdf import partition_pdf

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.environ["PATH"] += os.pathsep + r"C:\poppler-24.08.0\Library\bin"
os.environ["PATH"] += os.pathsep + r"C:\Program Files\Tesseract-OCR"



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
    
    # 3. 텍스트 추출 (✅ 수정된 부분)
    try:
        elements = partition_pdf(
            filename=file_path,
            extract_images_in_pdf=True,
            strategy="hi_res",
            pdfinfo_path="C:/Program Files/poppler-24.08.0/Library/bin/pdfinfo.exe",   # pdfinfo.exe 경로
            pdf_path="C:/Program Files/poppler-24.08.0/Library/bin/",                   # 🔥 bin 폴더까지 명시 (추가)
            detect_environment=False,                                     # 🔥 환경 자동탐지 끄기 (추가)
            languages=["eng", "kor"]                                       # ocr language
        )
        text = "\n".join([str(el) for el in elements])
        print(f"📝 텍스트 추출 완료 (길이 {len(text)}): {text[:100]}...")
    except Exception as e:
        print(f"❌ 텍스트 추출 실패: {str(e)}")
        return {"status": "fail", "reason": "text_extract_error"}
        
    
    print(f"🔍 file_path: {file_path}")
    print(f"🔍 text 길이: {len(text)}")

    # 4. DB 컬럼 설정
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

        # row 존재 여부 확인
        row = await conn.fetchrow("SELECT * FROM tb_attached WHERE mem_id = $1", mem_id)
        if not row:
            await conn.execute("""
                INSERT INTO tb_attached (mem_id, created_at, updated_at)
                VALUES ($1, NOW(), NOW())
            """, mem_id)
            print(f"🆕 mem_id '{mem_id}' 에 대한 새로운 row 삽입됨")

        # 첨부 파일 업데이트
        name_col_map = {
            "resume": "resume_name",
            "self_intro": "self_intro_name",
            "portfolio": "portfolio_name"
        }
        name_col = name_col_map[file_type]

        update_query = f"""
            UPDATE tb_attached
            SET {file_col} = $1,
                {text_col} = $2,
                {name_col} = $3,
                updated_at = NOW()
            WHERE mem_id = $4
        """
        await conn.execute(update_query, file_path, text, file.filename, mem_id)
        print("✅ DB 업데이트 완료")

        if not row or row["file_idx"] is None:
            print("❌ file_idx 조회 실패 또는 NULL")
            return {"status": "fail", "reason": "file_idx_null"}

        file_idx = row["file_idx"]
        print(f"📦 file_idx 반환: {file_idx}")

        return {
            "status": "success",
            "file_idx": file_idx,
            "path": file_path,
            "preview": text[:100]
        }

    except Exception as e:
        print(f"❌ DB 저장 실패: {str(e)}")
        return {"status": "fail", "reason": "db_error"}
