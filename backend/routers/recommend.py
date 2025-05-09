from fastapi import APIRouter, Form
from services.recommend_service import recommend_companies
from pydantic import BaseModel

router = APIRouter()

class RecommendRequest(BaseModel):
    tech_stack: str = None
    salary: int = None
    location: str = None

@router.post("/")  # 여기 중요!!! 슬래시 하나만!
async def recommend_company(req: RecommendRequest):
    tech_stack = req.tech_stack
    salary = req.salary
    location = req.location
    # user_documents = ["Python 개발자 경력", "React 프로젝트 경험"]
    results = recommend_companies(tech_stack, location, salary)
    return {"recommended_companies": results}

# ✅1. 사용자가 프론트에서 보낸 기술, 연봉, 장소 값이 req에 들어옴(JSON)
# recommend_service의 recommend_companies 함수에 들어감!
