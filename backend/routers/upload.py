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