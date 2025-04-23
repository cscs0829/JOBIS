import React, { FC } from "react";
import styles from "./CompanyCard.module.scss"; // SCSS 모듈 import
import { Company } from "../../types/types";

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className={styles.card}>
      {/* 이 div에 cardInfo 클래스를 적용합니다. */}
      <div className={styles.cardInfo}>
        <h3>{company.name}</h3>
        <p>기술 스택: {company.techStack.join(", ")}</p>
        <p>연봉: {company.salary}</p>
        <p>위치: {company.location}</p>
      </div>

      {/* 채용공고 링크 있으면 보기 버튼 표시 */}
      {company.link && (
        <a
          href={company.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applyBtn} // 버튼 스타일은 그대로 유지
        >
          공고 보기
        </a>
      )}
    </div>
  );
};

export default CompanyCard;