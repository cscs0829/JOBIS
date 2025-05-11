<p align="center">
  <img width="244" src="https://github.com/user-attachments/assets/253edd78-ab41-4670-9228-683c55d5affc">
</p>


## :star2: J.O.B.I.S :star2:
> :star: LLM과 LangChain 모델을 활용한 맞춤형 취업준비 서비스<br>
:star: 자기소개서 및 이력서, 포트폴리오를 첨부한 파일을 토대로 면접관 페르소나(유형)을 선택하여 모의면접 진행 및 피드백 제공<br>
:star: 키워드를 통한 자기소개서 생성 및 미리 작성한 자기소개서 피드백<br>
:star: Vector DB(Chroma)와 Embedding을 통한 유사도 검색으로 면접 실행 및 회사, 멘토 추천 <br>
## 프로젝트 소개 ✍🏻
<p align="center">
 <img src="https://img.shields.io/badge/React-v18.2.0-9cf?logo=React" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-v0.115.9-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-v13.10-blue?logo=Postgresql" alt="PostgreSQL"/>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-v5.3.3-3178C6?logo=typescript&logoColor=white" alt="typescript" />
  <img src="https://img.shields.io/badge/SCSS-v1.62.1-CC6699?logo=sass&logoColor=white" alt="scss" />
  <img src="https://img.shields.io/badge/LangChain-⚡-green?logo=python" alt="langchain"/>
  <img src="https://img.shields.io/badge/Chroma-VectorDB-yellow?logo=databricks" alt="chroma"/>
  <img src="https://img.shields.io/badge/OpenAI-API-black?logo=openai&logoColor=white" alt="openai"/>
  <a>
    <img width="600" src="https://github.com/user-attachments/assets/8f830045-62df-4a3f-a1c5-f60534805662" alt="JOBIS 메인화면" />
  </a>
</p>

---
## 🎬 시연 영상 👉 [JOBIS 프로젝트 시연 영상 (YouTube)](https://www.youtube.com/watch?v=5hazrcHVnf8)

### 1. 프로젝트 개요 📄
#### 주제 : OpenAI와 Langchain 모델을 활용한 맞춤형 취업 지원 서비스 :thumbsup:


사용자 1 : 다양한 유형의 면접을 준비하는 취준생 :scream:
- 다양한 면접관 페르소나를 선택하여 면접진행
- 면접 후 사용자의 답변에 따른 피드백 제공
---
사용자 2 : 자기소개서 작성에 어려움을 겪는 취준생 :sob:
- 사용자가 첨부한 이력서, 자기소개서, 포트폴리오 기반 + 사용자 입력값에 따른 자기소개서 작성
- 사전 자소서를 작성한 사용자에겐 맞춤형 피드백 제공
---
사용자 3 : 자신의 스펙과 관련된 기업 추천, 멘토 추천을 받고 싶은 취준생 :open_mouth:
- 사용자가 원하는 직무, 연봉 등 입력값과 유사성 높은 기업 추천
- 자신에게 맞는 적절한 멘토 검색 기능
  
---
### 2. 프로젝트 기간 🕛

2025-03-17 ~2025-05-12

## 3. 주요 기능 :computer:

:floppy_disk: 회원가입 및 로그인 <br>
:floppy_disk: AI면접 & 면접 피드백 <br>
:floppy_disk: 자기소개서 작성 & 자기소개서 피드백 <br>
:floppy_disk: 기업 추천 & 멘토추천 <br>

---

### 4. 개발환경  :open_file_folder:
### Frontend
<p align="left">
 <img src="https://img.shields.io/badge/React-v18.2.0-9cf?logo=React" alt="React" />
 <img src="https://img.shields.io/badge/SCSS-v1.62.1-CC6699?logo=sass&logoColor=white" alt="scss" />
</p>

### Backend
<p align="left">
 <img src="https://img.shields.io/badge/TypeScript-v5.3.3-3178C6?logo=typescript&logoColor=white" alt="typescript" />
 <img src="https://img.shields.io/badge/LangChain-⚡-green?logo=python" alt="langchain"/>
 <img src="https://img.shields.io/badge/TypeScript-v5.3.3-3178C6?logo=typescript&logoColor=white" alt="typescript" />
</p>

### Database
<p align="left">
<img src="https://img.shields.io/badge/PostgreSQL-v13.10-blue?logo=Postgresql" alt="PostgreSQL"/>
<img src="https://img.shields.io/badge/Chroma-VectorDB-yellow?logo=databricks" alt="chroma"/>
</p>

### API
<p align="left">
 <img src="https://img.shields.io/badge/OpenAI-API-black?logo=openai&logoColor=white" alt="openai"/>
</p>

---

## 5. 시스템 아키텍처 :black_nib:

**구성도**
**구성도**<br>
![Image](https://github.com/user-attachments/assets/ddd73dc8-6748-4c6d-bac6-f457117c0e8e)
```md
[사용자] → [웹 브라우저] → [FastAPI] → [PostgreDB]
```
:pushpin: 사용자는 웹 브라우저를 통해 서비스에 접속 <br> 
:pushpin: 서버는 React 프레임워크를 기반으로 구축 <br>
:pushpin: 데이터베이스는 PostgreDB, ChromaDB를 사용하여 데이터 저장 및 관리 <br>
:pushpin: OCR, Tesseract를 활용한 pdf파일 텍스트 추출 및 DB 저장 <br>
:pushpin: OpenAI API를 사용하여 면접진행 및 자기소개서 작성 기능 구현 <br>
:pushpin: ChromaDB 채용 공고 중인 기업 크롤링 데이터 저장, 유사성 비교 진행 후 기업 추천 기능 구현 <br>

---

## 6. 팀원 소개 :raising_hand:

| 이름 | 역할 |
|------|------|
| **문선웅** | 프로젝트 총괄, Back-end 담당, 산출문서 담당, 데이터 수집, 산출문서 담당, AI 면접 기능 담당 |
| **정경현** | Back-end 담당, 데이터 수집, 산출문서 작성, AI 자소서 기능 담당 |
| **박명훈** | Back-end 담당, 데이터 수집, 산출문서 작성, 기업 추천 담당 |
| **박창선** | Front-end 담당, 산출문서 작성, 웹사이트 제작, 반응형 웹사이트 구현 |



---

## 7. 추가 예정 서비스  :clipboard:

:black_nib: AI 화상 면접 <br>
:black_nib: 멘토-멘티 시스템 <br>
:black_nib: 다국어 지원 확대 <br>
:black_nib: 해외 채용 문화 및 트렌드 반영 <br>
:black_nib: 글로벌 기업 데이터베이스 구축 및 연계 <br>
:black_nib: 모바일 앱 개발 및 크로스 플랫폼 지원 <br>
:black_nib: 개인화된 대시보드 및 진행 상황 트래킹 기능 추가
  
---

## 8. 기대효과 및 활용 방안 :trophy:

:thumbsup: 구직자의 취업 준비 효율성 대폭 향상 <br>
:thumbsup: 객관적 피드백을 통한 역량 강화 <br>
:thumbsup: 기업-구직자 간 최적의 매칭 촉진 <br>
:thumbsup: 실제 기업 HR 부서와의 연계 및 B2B 모델 구상 <br>
:thumbsup: 취업 교육 프로그램과의 통합 서비스 개발 <br>
:thumbsup: 대학 및 교육 기관과의 파트너십 확대 <br>


---
## 9. 화면 구성 :tv:
![Image](https://github.com/user-attachments/assets/3dbaabb1-d75b-431f-bd48-5bdfc2013f99)
![Image](https://github.com/user-attachments/assets/88234b55-e8b9-4654-a9c7-152240c129f1)
![Image](https://github.com/user-attachments/assets/6aea6ef1-dcfe-40d4-b715-cca10deeeb9b)
![Image](https://github.com/user-attachments/assets/d4ab22cf-79bd-4a07-9369-a240d189560e)
![Image](https://github.com/user-attachments/assets/c8040d31-8501-42c9-8a74-ece37bdd31e4)
![Image](https://github.com/user-attachments/assets/56d378ff-c5dc-4ef3-8fc8-99e9ccbd7e9a)
![Image](https://github.com/user-attachments/assets/8fc450bc-d5ef-4382-91d6-4454662854c8)
![Image](https://github.com/user-attachments/assets/31f084cf-4cf9-469e-a81b-a6e95d0d38df)
![Image](https://github.com/user-attachments/assets/382df42a-8e9d-42d1-87e8-d0102e738eb3)
![Image](https://github.com/user-attachments/assets/61b61c9f-7070-4a01-ba13-75e2128035ab)
![Image](https://github.com/user-attachments/assets/7012ff5d-76c0-4cbe-89f8-97ab34887ff1)
![Image](https://github.com/user-attachments/assets/06b5fdbc-426b-43df-bc9b-a32fc0f1e085)
![Image](https://github.com/user-attachments/assets/8992cc64-4369-4467-8483-58d10b249c63)
![Image](https://github.com/user-attachments/assets/70ed4f0b-7eec-4e0d-a8d1-dad8abf7c6c6)
![Image](https://github.com/user-attachments/assets/37b618e3-eeda-4f12-9289-c4736d001607)
![Image](https://github.com/user-attachments/assets/f7c69bff-db15-499b-9128-156451273ac8)
![Image](https://github.com/user-attachments/assets/d6c9b54c-419c-4cf2-a06f-5d265105dcca)
![Image](https://github.com/user-attachments/assets/c650ee66-ec7b-4f1a-8bcf-5d075b37ac4f)
![Image](https://github.com/user-attachments/assets/42454b83-6a64-4102-b5a3-7a2ed0a5c1e3)
![Image](https://github.com/user-attachments/assets/756fd06a-28a6-4569-9573-8cda62204743)

:link: [화면설계서 링크](https://www.figma.com/design/PkABMn1ZnHp2tuFcA8yRcM/-%EA%B8%B0%ED%9A%8D-%ED%99%94%EB%A9%B4%EC%84%A4%EA%B3%84%EC%84%9C-%ED%85%9C%ED%94%8C%EB%A6%BF-UX-UI-Wireframe-Template-KOR--UX-UI--Community-?node-id=0-1&p=f)
---


