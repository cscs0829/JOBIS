// src/pages/CompanyRecommendation.tsx
import React, { useState } from "react";
import styles from "./CompanyRecommendation.module.scss";
import CompanyNavbar from "../components/Company/CompanyNavbar";
import CompanySearch from "../components/Company/CompanySearch";
import CompanyCard from "../components/Company/CompanyCard";
// import Modal from "../components/Modal/Modal"; // 이전 import 제거
import SearchModal from "../components/Company/SearchModal"; // 수정된 경로와 이름으로 import
import Button from "../components/Button/Button";
import { Company, CompanySearchCriteria, CompanyMentorNavbarProps } from "../types/types";
import { FaSearch } from "react-icons/fa";

const CompanyRecommendation = () => {
  const [searchResult, setSearchResult] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navbarProps: CompanyMentorNavbarProps = {
    selectedTab: 0,
    handleTabChange: () => {},
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCompanySearch = async (criteria: CompanySearchCriteria) => {
    try {
      const response = await fetch("http://localhost:9000/recommend/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tech_stack: criteria.techStack || null,
          salary: criteria.salary ? Number(criteria.salary) : null,
          location: criteria.location || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const companies = data.recommended_companies || [];

      const formatted: Company[] = companies.map((item: any, index: number) => ({
        id: index,
        name: item.name || "정보 없음",
       // 🔁 수정: 쉼표 기준 분리 후 배열로 전달
        techStack: criteria.techStack
        ? criteria.techStack.split(",").map((s: string) => s.trim()).filter(Boolean)
        : ["정보 없음"],
        location: criteria.location || "정보 없음", // ✅ 무조건 사용자가 입력한 값
        link: item.link,
        similarity: item.similarity || 0
      }));
      
      
      


      setSearchResult(formatted);
      closeModal();
    } catch (error) {
      console.error("회사 추천 오류:", error);
      alert("회사 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.companyMentorPage}>
      <div className={styles.companyMentorContainer}>
        <div className={styles.companyMentorLeft}>
          <CompanyNavbar {...navbarProps} />
        </div>
        <div className={styles.companyMentorRight}>
          <div className={styles.searchTriggerContainer}>
            <Button onClick={openModal} primary>
              <FaSearch style={{ marginRight: '8px' }} />
              회사 검색하기
            </Button>
          </div>

          <div className={styles.resultContainer}>
            {searchResult.length > 0 ? (
              searchResult.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))
            ) : (
              <p className={styles.noResults}>검색 조건을 입력하고 회사를 찾아보세요!</p>
            )}
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 사용 이름 변경: Modal -> SearchModal */}
      <SearchModal isOpen={isModalOpen} onClose={closeModal} title="회사 검색 조건 입력">
        <CompanySearch onSearch={handleCompanySearch} />
      </SearchModal>
    </div>
  );
};

export default CompanyRecommendation;