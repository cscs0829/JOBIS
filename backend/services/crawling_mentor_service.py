from bs4 import BeautifulSoup
import requests
import json
import os
from langchain.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings


def crawl_itdaa_mentors():
    url = "https://itdaa.net/mentors"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, "html.parser")

    mentors = []
    for card in soup.select(".mentor_list_item"):
        try:
            name = card.select_one(".mentor_list_name").text.strip()
            org = card.select_one(".mentor_list_organization_container").get_text(separator=" / ").strip()
            intro = card.select_one(".mentor_list_expertise").text.strip()
            link_tag = card.select_one("a[href]")
            link = "https://itdaa.net" + link_tag["href"] if link_tag else "링크 없음"

            description = f"{org} / {intro}"
            mentors.append({
                "name": name,
                "job": org,
                "intro": intro,
                "link": link,
                "description": description
            })
        except Exception as e:
            print("❌ 멘토 하나 크롤링 실패:", e)

    return mentors


def save_mentors_to_json(mentors, filepath="data/mentors.json"):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(mentors, f, ensure_ascii=False, indent=2)


def embed_and_store_mentors():
    with open("data/mentors.json", "r", encoding="utf-8") as f:
        mentor_data = json.load(f)

    documents = [m["description"] for m in mentor_data]
    vectorstore = Chroma.from_texts(
        documents,
        embedding=OpenAIEmbeddings(),
        persist_directory="vector_db/mentors"
    )
    vectorstore.persist()


# ✅ 실행 전용
if __name__ == "__main__":
    mentors = crawl_itdaa_mentors()
    save_mentors_to_json(mentors)
    embed_and_store_mentors()
    print("✅ mentors.json 저장 및 벡터 임베딩 완료!")
