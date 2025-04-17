// src/components/Company/CompanySearch.tsx
import React, { useState, FC } from "react";
import styles from "./CompanySearch.module.scss";
import { CompanySearchCriteria } from "../../types/types";
import Input from "../Input/Input";
import Button from "../Button/Button";

const CompanySearch: FC<{ onSearch: (criteria: CompanySearchCriteria) => void }> = ({ onSearch }) => {
  const [techStack, setTechStack] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch({ techStack, salary, location });
  };

  return (
    <div className={styles.searchContainer}>
      <h2>회사 검색</h2>
      <Input label="기술 스택" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
      <Input label="연봉" value={salary} onChange={(e) => setSalary(e.target.value)} />
      <Input label="위치" value={location} onChange={(e) => setLocation(e.target.value)} />
      <Button onClick={handleSearch}>검색하기</Button>
    </div>
  );
};

export default CompanySearch;