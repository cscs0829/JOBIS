from services.crawling_service import crawl_saramin_jobs
from utils.embedding_utils import get_embedding, compute_cosine_similarity

def recommend_companies(tech_stack=None, location=None, salary=None):
    try:
        # ✅ 모든 입력을 문자열로 안전하게 변환
        combined_text = " ".join(map(str, filter(None, [tech_stack, location, salary]))).strip()
        user_vector = get_embedding(combined_text)
        if user_vector is None:
            raise ValueError("❌ 사용자 임베딩 생성 실패")

        tech_stacks = [stack.strip() for stack in tech_stack.split(",")] if tech_stack else []
        job_posts = crawl_saramin_jobs(tech_stacks, location, salary)
        if not job_posts:
            print("⚠️ 채용 공고가 없습니다.")
            return []

        results = []
        for idx, job in enumerate(job_posts):
            job_vector = get_embedding(job["description"])
            if job_vector is None:
                continue
            similarity = compute_cosine_similarity(user_vector, job_vector)
            if similarity <= 0:
                continue
            results.append({
                "id": idx,
                "name": job["company"],
                "techStack": tech_stacks if tech_stacks else ["정보 없음"],
                "location": location or "정보 없음",
                "link": job["link"],
                "similarity": round(float(similarity), 3)
            })

        return sorted(results, key=lambda x: x["similarity"], reverse=True)[:10]

    except Exception as e:
        print(f"❌ 회사 추천 중 오류 발생: {e}")
        return []
