from fastapi import APIRouter, HTTPException, Form
from openai import OpenAI
import os
from dotenv import load_dotenv

from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from DB.Connection import get_db_connection

load_dotenv()
router = APIRouter()
openai = OpenAI(api_key=os.getenv("OPENAI_API"))

@router.post("/generate-draft")
async def generate_draft(
    mem_id: str = Form(...),
    field: str = Form(...),
    company: str = Form(...),
    emphasisPoints: str = Form(...),
    qualifications: str = Form(...),
    projects: str = Form(...),
    experiences: str = Form(...),
    major: str = Form(...)
):
    try:
        conn = await get_db_connection()
        row = await conn.fetchrow(
            "SELECT resume_raw_text, self_intro_raw_text, portfolio_raw_text FROM tb_attached WHERE mem_id = $1",
            mem_id
        )
        await conn.close()

        if not row:
            raise HTTPException(status_code=400, detail="해당 mem_id의 첨부 텍스트를 찾을 수 없습니다.")

        total_text = "\n\n".join([
            row["resume_raw_text"] or "",
            row["self_intro_raw_text"] or "",
            row["portfolio_raw_text"] or ""
        ]).strip()

        if not total_text:
            mode = "none"
        elif len(total_text) < 300:
            mode = "draft"
        else:
            mode = "full"

        similar_text = ""
        if mode != "none":
            splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
            docs = splitter.create_documents([total_text])
            embedding = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
            vectorstore = Chroma.from_documents(
                documents=docs,
                embedding=embedding,
                persist_directory="./vectorstore/jasoseo_mem"
            )
            retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
            relevant_docs = retriever.get_relevant_documents(emphasisPoints)
            similar_text = "\n\n".join([doc.page_content for doc in relevant_docs])

        # 프롬프트 구성
        prompt = "너는 전문 HR 채용담당자이자 자소서 첨삭 전문가야.\n"

        if mode == "none":
            prompt += "\n사용자가 자소서를 작성하지 않았기 때문에 아래 정보를 바탕으로 전체 자소서를 새로 작성해줘."
        elif mode == "draft":
            prompt += "\n사용자가 자소서를 일부 작성했지만 미완성 상태야. 아래 내용을 참고해서 자연스럽게 이어서 완성해줘."
        else:  # mode == "full"
            prompt += "\n사용자가 자소서를 충분히 작성했기 때문에 전체 문장을 더 매끄럽고 설득력 있게 다듬어줘."

        prompt += f"""

[사용자 입력 정보]
- 지원 분야: {field}
- 지원 회사: {company}
- 자격증: {qualifications}
- 프로젝트 경험: {projects}
- 실무/인턴 경험: {experiences}
- 전공: {major}
- 강조 포인트: {emphasisPoints}
"""

        if similar_text.strip():
            prompt += f"\n[첨부 문서 기반 유사 문장 요약]\n{similar_text}\n"

        prompt += """

[작성 조건]
- 각 항목은 500~1000자 분량
- 강조 포인트는 반드시 자연스럽게 포함
- 유사 문장은 복붙하지 말고 문맥에 맞게 표현해서 반영
- 진정성 있고 구체적인 문장으로 작성
- 중복 표현 피하고 문법, 맞춤법 정확히
"""

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        draft = response.choices[0].message.content.strip()

        return {"message": "자기소개서 초안 생성 완료", "draft": draft}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"오류 발생: {str(e)}")
