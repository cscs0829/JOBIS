import requests
from bs4 import BeautifulSoup
from urllib.parse import quote

def crawl_saramin_jobs(tech_stack=None, location=None, salary=None):
    print(f"tech_stack : {tech_stack}")

    # if tech_stack:
    #     tech_stack = tech_stack.replace(",", " ")  # ✅ 콤마(,)를 띄어쓰기( )로 바꾼다

    # location이 서울, 경기, 광주 이런식으로 넘어온다
    # 하지만 검색할 때는 서울은 101000, 경기는 102000 이런식으로 넘겨줘야 한다 광주 loc_mcd=103000

    # location loc_mcd=106000
    region_code_map = {
        "서울": "101000",
        "경기": "102000",
        "광주": "103000",
        "대구": "104000",
        "대전": "105000",
        "부산": "106000",
        "울산": "107000",
        "인천": "108000"
    }

    # tech_stack searchword=react+python+node
    tech_stack_str = "+".join(tech_stack) if tech_stack else ""
    search_url = f"https://www.saramin.co.kr/zf_user/search?searchword={quote(tech_stack_str or '')}"
    print(search_url)
    
    # 지역(location) 코드 처리
    loc_code = region_code_map.get(location)
    if loc_code:
        search_url += f"&loc_mcd={loc_code}"

    # 연봉 코드 처리(salary)
    def get_salary_code(salary_str):
        try:
            salary = int(salary_str)
        except ValueError:
            return None

        if salary < 2400:
            return None  # 전체로 처리 (코드 없음)

        # 2400 이상 ~ 4000 미만: 200만 원 단위로 증가 (8~15)
        if 2400 <= salary < 4000:
            ranges = list(range(2400, 4000, 200))  # [2400, 2600, 2800, ...]
            return 8 + ranges.index(max([r for r in ranges if salary >= r]))

        # 4000 이상 ~ 10000 미만: 1000만 원 단위로 증가 (16~21)
        if 4000 <= salary < 10000:
            ranges = list(range(4000, 10000, 1000))  # [4000, 5000, ..., 9000]
            return 16 + ranges.index(max([r for r in ranges if salary >= r]))

        # 1억 이상
        return 22

    # ✅ salary 코드 URL 추가 
    salary_code = get_salary_code(salary)
    if salary_code:
        search_url += f"&sal_min={salary_code}"

    print("최종 URL:", search_url)  

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(search_url, headers=headers, timeout=5)
    soup = BeautifulSoup(response.text, "html.parser")

    job_posts = []

    for post in soup.select(".item_recruit"):
        title_tag = post.select_one(".job_tit a")
        company_tag = post.select_one(".corp_name a")

        if not title_tag or not company_tag:
            continue

        title = title_tag.text.strip()
        link = "https://www.saramin.co.kr" + title_tag['href']
        company = company_tag.text.strip()
        description = title + " " + company

        job_posts.append({
            "title": title,
            "company": company,
            "link": link,
            "description": description
        })
    # print(job_posts)

    return job_posts
