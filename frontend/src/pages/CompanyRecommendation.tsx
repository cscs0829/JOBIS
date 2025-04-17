// src/pages/CompanyRecommendation.tsx
import React, { useState } from "react";
import styles from "./CompanyRecommendation.module.scss";
import CompanyNavbar from "../components/Company/CompanyNavbar";
import CompanySearch from "../components/Company/CompanySearch";
import CompanyCard from "../components/Company/CompanyCard";
import { Company, CompanySearchCriteria, CompanyMentorNavbarProps } from "../types/types";

const CompanyRecommendation = () => { // 컴포넌트 이름 변경
  const [searchResult, setSearchResult] = useState<Company[]>([]);
  const navbarProps: CompanyMentorNavbarProps = {
    selectedTab: 0,
    handleTabChange: () => {},
  };

  const handleCompanySearch = (criteria: CompanySearchCriteria) => {
    // 실제 검색 로직 구현 (API 호출, 데이터 필터링 등)
    // 예시:
    const dummyData: Company[] = [
      { id: 1, name: "회사 A", techStack: ["React", "Node.js"], salary: "5000", location: "서울" },
      { id: 2, name: "회사 B", techStack: ["Vue.js", "Spring Boot"], salary: "6000", location: "경기" },
    ];
    setSearchResult(dummyData.filter(company => 
      (criteria.techStack ? company.techStack.includes(criteria.techStack) : true) &&
      (criteria.salary ? company.salary === criteria.salary : true) &&
      (criteria.location ? company.location === criteria.location : true)
    ));
  };

  return (
    <div className={styles.companyMentorPage}>
      <div className={styles.companyMentorContainer}>
        <div className={styles.companyMentorLeft}>
          <CompanyNavbar
            {...navbarProps}
          />
        </div>
        <div className={styles.companyMentorRight}>
          <CompanySearch onSearch={handleCompanySearch} />
          <div className={styles.resultContainer}>
            {searchResult.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRecommendation; 