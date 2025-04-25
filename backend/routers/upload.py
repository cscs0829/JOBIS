from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from .file_utils import save_uploaded_file_and_extract_text

router = APIRouter()

@router.post("/upload")
async def upload_file(
    mem_id: str = Form(...),
    file_type: str = Form(...),
    file: UploadFile = File(...)
):
    print(f"📥 업로드 요청 도착! mem_id: {mem_id}, type: {file_type}, filename: {file.filename}")
    result = await save_uploaded_file_and_extract_text(mem_id, file_type, file)
    return {"status": "success", "preview": result}

@router.get("/uploaded-files")
async def get_uploaded_files(mem_id: str):
    from DB.Connection import get_db_connection
    conn = await get_db_connection()
    row = await conn.fetchrow("""
        SELECT resume_name, self_intro_name, portfolio_name
        FROM tb_attached
        WHERE mem_id = $1
    """, mem_id)
    await conn.close()

    if row:
        return {
            "resume": row["resume_name"],
            "self_intro": row["self_intro_name"],
            "portfolio": row["portfolio_name"],
        }
    return {"resume": None, "self_intro": None, "portfolio": None}

@router.post("/delete-file")
async def delete_uploaded_file(mem_id: str = Form(...), file_type: str = Form(...)):
    from DB.Connection import get_db_connection

    file_column_map = {
        "resume": ("resume", "resume_name", "resume_raw_text"),
        "self_intro": ("self_introduction", "self_intro_name", "self_intro_raw_text"),
        "portfolio": ("portfolio", "portfolio_name", "portfolio_raw_text")
    }

    if file_type not in file_column_map:
        raise HTTPException(status_code=400, detail="Invalid file_type")

    file_col, name_col, text_col = file_column_map[file_type]

    try:
        conn = await get_db_connection()
        await conn.execute(f"""
            UPDATE tb_attached
            SET {file_col} = NULL, {name_col} = NULL, {text_col} = NULL, updated_at = NOW()
            WHERE mem_id = $1
        """, mem_id)
        await conn.close()

        return {"status": "success", "message": f"{file_type} 파일이 삭제되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 삭제 중 오류 발생: {str(e)}")