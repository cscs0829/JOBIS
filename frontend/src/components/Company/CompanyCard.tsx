import React, { FC } from "react";
import styles from "./CompanyCard.module.scss"; // SCSS 모듈 import
import { Company } from "../../types/types";

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className={styles.card}>
      {/* 카드 정보 */}
      <div className={styles.cardInfo}>
        <h3>{company.name}</h3>
        <p>기술 스택: {company.techStack.join(", ")}</p>  {/* ✅ 수정 */}
        <p>위치: {company.location}</p>
      </div>


      {/* 채용공고 링크 있으면 보기 버튼 표시 */}
      {company.link && (
        <a
          href={company.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applyBtn}
        >
          채용공고 보기
        </a>
      )}
    </div>
  );
};

export default CompanyCard;
