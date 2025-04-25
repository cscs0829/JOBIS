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
