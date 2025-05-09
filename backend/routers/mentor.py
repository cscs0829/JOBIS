from fastapi import APIRouter
from pydantic import BaseModel
from services.recommend_mentor_service import recommend_mentors_from_query

router = APIRouter()

class MentorQueryRequest(BaseModel):
    query: str

@router.post("/mentor-recommendation")
async def mentor_recommend(req: MentorQueryRequest):
    query = req.query
    print("받은 쿼리 : ", req.query)
    results = recommend_mentors_from_query(query)
    print("추천 결과 : ", results)
    return {"recommended_mentors": results}
