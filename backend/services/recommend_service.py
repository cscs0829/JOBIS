from services.crawling_service import crawl_saramin_jobs
from utils.embedding_utils import get_embedding, compute_cosine_similarity

# ✅ 프론트에서 보낸 기술스택, 지역, 연봉 정보를 바탕으로 회사 추천 결과를 반환하는 함수
def recommend_companies(tech_stack=None, location=None, salary=None):
    # 1️⃣ 사용자 입력값(기술스택, 지역, 연봉)을 하나의 문장으로 결합하여 임베딩 벡터 생성
    combined_text = f"{tech_stack or ''} {location or ''} {salary or ''}"
    user_vector = get_embedding(combined_text)  # 🔁 utils/embedding_utils.py에서 GPT 기반 임베딩 수행

    # 2️⃣ 입력값 확인용 출력 (디버깅용)
    print(f"tech_stack : {tech_stack}")
    print(f"location : {location}")
    print(f"salary : {salary}")

    # 3️⃣ 기술스택을 리스트로 변환 (예: "python,react" → ["python", "react"])
    tech_stacks = tech_stack.split(",") if tech_stack else []
    tech_stacks = [stack.strip() for stack in tech_stacks]  # 띄어쓰기 제거

    # 4️⃣ 사람인 사이트에서 채용 공고 크롤링
    job_posts = crawl_saramin_jobs(tech_stacks, location, salary)

    # 5️⃣ 각 공고와 사용자의 입력값을 비교하여 유사도 계산
    results = []
    for idx, job in enumerate(job_posts):
        job_vector = get_embedding(job["description"])  # 공고 설명을 벡터화
        similarity = compute_cosine_similarity(user_vector, job_vector)  # 사용자와 공고 간 유사도 계산

        # 6️⃣ 결과를 리스트에 추가
        results.append({
            "id": idx,
            "name": job["company"],
            "techStack": tech_stacks if tech_stacks else ["정보 없음"],
            "location": location if location else "정보 없음",
            "link": job["link"],
            "similarity": round(float(similarity), 3)  # 유사도는 소수점 3자리까지
        })

    # 7️⃣ 유사도가 높은 순으로 정렬하고 상위 10개만 추출
    sorted_results = sorted(results, key=lambda x: x["similarity"], reverse=True)
    return sorted_results[:10]
