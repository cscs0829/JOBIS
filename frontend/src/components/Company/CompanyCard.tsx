// src/components/Company/CompanyCard.tsx
import React, { FC } from "react";
import styles from "./CompanyCard.module.scss";
import { CompanyCardProps } from "../../types/types";

const CompanyCard: FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className={styles.card}>
      <h3>{company.name}</h3>
      <p>기술 스택: {company.techStack.join(", ")}</p>
      <p>연봉: {company.salary}</p>
      <p>위치: {company.location}</p>
    </div>
  );
};

export default CompanyCard;