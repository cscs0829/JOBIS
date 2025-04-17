from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from DB.Connection import get_db_connection
import datetime
import os

async def generate_ai_guide(mem_id, job_position, dream_company, strong_point, career_level, self_intro_text, portfolio_text):
    try:
        # ✅ mem_id가 비어있을 경우 예외 처리
        if not mem_id:
            raise ValueError("mem_id가 비어 있습니다. 로그인 후 이용해주세요.")

        # 1. 벡터 DB 초기화 및 임베딩
        vectorstore = Chroma.from_texts(
            texts=[self_intro_text, portfolio_text],
            embedding=OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY")),
            persist_directory="./vectorstore/guide"
        )
        retriever = vectorstore.as_retriever()
        docs = retriever.get_relevant_documents(f"{job_position} {dream_company} {strong_point}")

        # 2. 프롬프트 구성
        prompt = ChatPromptTemplate.from_template(
            f"""
            당신은 취업 준비생을 돕는 AI 자기소개서 코치입니다.

            아래는 사용자가 작성한 자기소개서 또는 포트폴리오 내용입니다:
            {{context}}

            사용자는 \"{job_position}\" 직무에 지원하며, 희망 회사는 \"{dream_company}\"입니다.
            강조하고 싶은 강점은 \"{strong_point}\"입니다.
            또한 사용자는 현재 \"{career_level}\"입니다.

            위 내용과 다음 조건에 따라 새로운 자기소개서를 작성해주세요:
            - 사용자가 기존에 작성한 자기소개서 및 포트폴리오 내용을 최대한 반영
            - 문장은 진정성 있고 자연스럽게 작성
            - 강점을 중심으로 구체적인 예시나 경험 중심 작성
            - 지원 동기는 해당 직무 및 회사에 적합하게 구성
            - 경력직이라면 이력과 성과 중심으로, 신입이라면 성장 과정과 동기 중심으로 작성
            - 해당 직무와 회사에 잘 맞는 동기를 담아줄 것
            - 500~1000자 내외 분량
            - 불필요한 결과나 설명 하지말고 바로 자기소개서 작성할 것
            - 불필요한 구두점이나 기호 사용하지 말 것
            - 불필요하게 길게 작성하지 말 것
            - 핵심이 되는 사례가 있으면 구체적으로 작성할 것
            - \n으로 문단 구분

            
            """
        )

        llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0.7,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )

        chain = prompt | llm | StrOutputParser()

        result = chain.invoke({
            "context": "\n\n".join([doc.page_content for doc in docs]),
            "job_position": job_position,
            "dream_company": dream_company,
            "strong_point": strong_point
        })

    except Exception as gpt_error:
        print(f"\u274c GPT 생성 중 오류 발생: {gpt_error}")
        return "[AI 자기소개서 생성 중 오류 발생]"

    try:
        conn = await get_db_connection()

        # 3. tb_attached에 파일 저장
        await conn.execute("""
            INSERT INTO tb_attached (mem_id, resume, self_introduction, portfolio, job_position, dream_company, created_at, updated_at)
            VALUES ($1, '', $2, $3, $4, $5, $6, $6)
        """, mem_id, self_intro_text[:1000], portfolio_text[:1000], job_position, dream_company, datetime.datetime.now())

        # 4. 방금 저장한 file_idx 조회
        row = await conn.fetchrow("""
            SELECT file_idx FROM tb_attached 
            WHERE mem_id = $1 
            ORDER BY created_at DESC 
            LIMIT 1
        """, mem_id)

        if not row:
            print("\u274c file_idx를 찾을 수 없습니다.")
            return "[파일 정보가 없어 DB 저장 실패]"

        file_idx = row["file_idx"]

        # 5. 자기소개서 저장
        await conn.execute("""
            INSERT INTO tb_self_introduction 
            (mem_id, file_idx, intro_type, intro_keyword, ai_introduction, created_at)
            VALUES ($1, $2, 'K', $3, $4, $5)
        """, mem_id, file_idx, f"{job_position},{dream_company},{strong_point}", result, datetime.datetime.now())

        await conn.close()
    except Exception as db_error:
        print(f"\u274c DB 저장 중 오류 발생: {db_error}")
        return "[AI 생성은 완료되었지만, DB 저장 중 오류 발생]"

    return result
