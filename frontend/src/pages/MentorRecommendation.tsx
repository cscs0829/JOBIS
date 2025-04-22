// src/pages/MentorRecommendation.tsx
import React, { useState } from "react";
import styles from "./MentorRecommendation.module.scss";
import MentorNavbar, { MentorNavbarProps } from "../components/Mentor/MentorNavbar";
import MentorSearch from "../components/Mentor/MentorSearch";
import MentorCard from "../components/Mentor/MentorCard";
import { Mentor, MentorSearchCriteria } from "../types/types";
import Button from "../components/Button/Button";

const MentorRecommendation = () => { // 컴포넌트 이름 변경
    const [searchResult, setSearchResult] = useState<Mentor[]>([]);
    const navbarProps: MentorNavbarProps = { // MentorNavbarProps 타입 사용
        selectedTab: 1,
        handleTabChange: () => {},
    };

    const handleMentorSearch = (criteria: MentorSearchCriteria) => {
        // 실제 검색 로직 구현 (API 호출, 데이터 필터링 등)
        // 예시:
        const dummyData: Mentor[] = [
            { id: 1, nickname: "멘토A", techStack: ["React", "Node.js"], location: "서울", price: { min: 30000, max: 50000 } },
            { id: 2, nickname: "멘토B", techStack: ["Vue.js", "Spring Boot"], location: "경기", company: "카카오", price: { min: 40000, max: 60000 } },
            { id: 3, nickname: "멘토C", techStack: ["Python", "Django"], location: "서울", price: { min: 20000, max: 40000 } },
        ];

        const filteredData = dummyData.filter(mentor => {
            const techStackMatch = criteria.techStack ? mentor.techStack.includes(criteria.techStack) : true;
            const locationMatch = criteria.location ? mentor.location === criteria.location : true;
            const priceMinMatch = criteria.price?.min !== undefined ? mentor.price.max >= criteria.price.min : true;
            const priceMaxMatch = criteria.price?.max !== undefined ? mentor.price.min <= criteria.price.max : true;
            return techStackMatch && locationMatch && priceMinMatch && priceMaxMatch;
        });

        setSearchResult(filteredData);
    };

    const handleAddMentor = () => {
        // 멘토 추가 로직 (예: 모달 열기, 페이지 이동 등)
        alert("멘토 추가 기능은 아직 구현되지 않았습니다.");
    };

    return (
        <div className={styles.companyMentorPage}>
            <div className={styles.companyMentorContainer}>
                <div className={styles.companyMentorLeft}>
                    <MentorNavbar
                        {...navbarProps}
                    />
                </div>
                <div className={styles.companyMentorRight}>
                    <MentorSearch onSearch={handleMentorSearch} />
                    <div className={styles.resultContainer}>
                        {searchResult.map(mentor => (
                            <MentorCard key={mentor.id} mentor={mentor} />
                        ))}
                    </div>
                    <div className={styles.addButtonContainer}>
                        <Button onClick={handleAddMentor}>멘토 추가</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorRecommendation;