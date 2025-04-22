// src/pages/CompanyRecommendation.tsx

import React, { useState } from "react";
import styles from "./CompanyRecommendation.module.scss";
import CompanyNavbar from "../components/Company/CompanyNavbar";
import CompanySearch from "../components/Company/CompanySearch";
import CompanyCard from "../components/Company/CompanyCard";
import { Company, CompanySearchCriteria, CompanyMentorNavbarProps } from "../types/types";

const CompanyRecommendation = () => {
  const [searchResult, setSearchResult] = useState<Company[]>([]);
  const navbarProps: CompanyMentorNavbarProps = {
    selectedTab: 0,
    handleTabChange: () => {},
  };

  const handleCompanySearch = async (criteria: CompanySearchCriteria) => {
    try {
      const response = await fetch("http://localhost:9000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tech_stack: criteria.techStack,
          salary: Number(criteria.salary),
          location: criteria.location,
        }),
      });

      const data = await response.json();

      const formatted: Company[] = data.map((item: any, index: number) => ({
        id: index,
        name: item.company,
        techStack: [criteria.techStack],
        salary: criteria.salary,
        location: criteria.location,
        url: item.link, // CompanyCard에서 클릭 시 사용 가능
      }));

      setSearchResult(formatted);
    } catch (error) {
      console.error("회사 추천 오류:", error);
    }
  };

  return (
    <div className={styles.companyMentorPage}>
      <div className={styles.companyMentorContainer}>
        <div className={styles.companyMentorLeft}>
          <CompanyNavbar {...navbarProps} />
        </div>
        <div className={styles.companyMentorRight}>
          <CompanySearch onSearch={handleCompanySearch} />
          <div className={styles.resultContainer}>
            {searchResult.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRecommendation;
