from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import requests
from bs4 import BeautifulSoup
from urllib.parse import quote  # URL 인코딩을 위한 모듈

router = APIRouter()

# -------------------- 회사 추천 --------------------

class RecommendRequest(BaseModel):
    tech_stack: str
    salary: int
    location: str

class RecommendResponse(BaseModel):
    company: str
    link: str

@router.post("/", response_model=List[RecommendResponse])
async def recommend_company(req: RecommendRequest):
    try:
        # URL 인코딩 및 User-Agent 추가
        url = f"https://www.saramin.co.kr/zf_user/search?searchword={quote(req.tech_stack)}+{quote(req.location)}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=5)
        
        # HTML 구조 확인
        print(response.text)  # HTML 출력하여 구조 확인
        soup = BeautifulSoup(response.text, "html.parser")

        results = []
        for item in soup.select(".job_tit a"):  # HTML 구조에 맞는 셀렉터 확인
            company = item.get_text(strip=True)
            link = item.get("href", "")
            if company and link:
                results.append({
                    "company": company,
                    "link": f"https://www.saramin.co.kr{link}"
                })

        return results[:10]
    except Exception as e:
        print("회사 추천 오류:", e)
        return [{"company": f"크롤링 실패: {str(e)}", "link": ""}]


        