import fitz  # PyMuPDF

def pdf_to_text(file_bytes: bytes) -> str:
    doc = fitz.open("pdf", file_bytes)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()