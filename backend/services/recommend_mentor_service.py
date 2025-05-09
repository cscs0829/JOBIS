from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
import json
import os
import requests
from bs4 import BeautifulSoup

# ✅ selenium 관련 모듈
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# ✅ 병렬 처리용
import concurrent.futures

# ✅ 글로벌 멘토 캐시 (메모리용)
mentor_cache = {}

# ✅ 크롬 드라이버 경로 (path 옵션 제거: 구버전 호환)
CHROMEDRIVER_PATH = ChromeDriverManager().install()

# ✅ 멘토 제목 크롤링 + 캐싱
def get_mentor_description_from_detail(link: str) -> str:
    if link in mentor_cache:
        return mentor_cache[link]

    try:
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        driver = webdriver.Chrome(service=Service(CHROMEDRIVER_PATH), options=chrome_options)
        driver.get(link)
        driver.implicitly_wait(1)  # 빠르게 끝내기

        soup = BeautifulSoup(driver.page_source, "html.parser")
        driver.quit()

        title_tag = soup.select_one("h1")
        if title_tag:
            text = title_tag.get_text(strip=True)
            result = f"이 멘토는 {text}"
            mentor_cache[link] = result
            print(f"✅ 멘토 제목 캐싱 완료: {text}")
            return result
        else:
            print("❌ 제목 태그를 찾지 못했습니다.")
    except Exception as e:
        print(f"❌ Selenium 파싱 실패: {e}")

    return "이 멘토는 현직자의 실전 멘토링을 제공합니다."


# ✅ 멘토 추천 기능
def recommend_mentors_from_query(query: str):
    cache_path = f"data/mentor_reco_cache_{query}.json"
    if os.path.exists(cache_path):
        print("⚡ 캐시에서 추천 결과 불러옴")
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)

    search_url = f"https://itdaa.net/classes?search={query}"
    response = requests.get(search_url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, "html.parser")
    class_cards = soup.select("a[href^='/meetings/']")

    print(f"🔍 검색 결과 카드 수: {len(class_cards)}")

    seen_links = set()
    mentor_links = []

    for card in class_cards:
        link = "https://itdaa.net" + card["href"]
        if link in seen_links:
            continue
        seen_links.add(link)
        mentor_links.append(link)
        if len(mentor_links) >= 5:
            break

    # ✅ 병렬 실행 (최대 2개 동시에)
    with concurrent.futures.ProcessPoolExecutor(max_workers=2) as executor:
        descriptions = list(executor.map(get_mentor_description_from_detail, mentor_links))

    # ✅ 결과 구성
    recommended = []
    for idx, (link, nickname) in enumerate(zip(mentor_links, descriptions)):
        recommended.append({
            "id": idx,
            "nickname": nickname,
            "company": "itdaa 추천 클래스",
            "techStack": [],
            "mentoringTopics": [],
            "targetMentees": [],
            "yearsExperience": "",
            "price": None,
            "meetingType": "",
            "meetingLocation": "",
            "link": link
        })

    # ✅ JSON 캐시 저장
    os.makedirs("data", exist_ok=True)
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(recommended, f, ensure_ascii=False, indent=2)

    print("🟢 추천 결과:", recommended)
    return recommended
