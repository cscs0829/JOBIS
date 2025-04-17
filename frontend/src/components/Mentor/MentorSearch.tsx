import React, { useState, FC } from "react";
import styles from "./MentorSearch.module.scss";
import { MentorSearchCriteria } from "../../types/types";
import Input from "../Input/Input";
import Button from "../Button/Button";

const MentorSearch: FC<{ onSearch: (criteria: MentorSearchCriteria) => void }> = ({ onSearch }) => {
  const [techStack, setTechStack] = useState("");
  const [location, setLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSearch = () => {
    const criteria: MentorSearchCriteria = {
      techStack,
      location,
      price: {
        min: priceMin ? parseInt(priceMin) : undefined,
        max: priceMax ? parseInt(priceMax) : undefined,
      },
    };
    onSearch(criteria);
  };

  return (
    <div className={styles.searchContainer}>
      <h2>멘토 검색</h2>
      <Input label="기술 스택" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
      <Input label="위치" value={location} onChange={(e) => setLocation(e.target.value)} />
      <div className={styles.priceRange}>
        <Input label="가격 (최소)" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
        <Input label="가격 (최대)" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
      </div>
      <Button onClick={handleSearch}>검색하기</Button>
    </div>
  );
};

export default MentorSearch;