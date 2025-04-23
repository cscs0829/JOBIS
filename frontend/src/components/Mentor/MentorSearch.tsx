import React, { useState, FC, useEffect } from "react"; // useEffect 추가 (선택 사항: 디바운싱 등)
import styles from "./MentorSearch.module.scss";
import { MentorSearchCriteria } from "../../types/types";
import Input from "../Input/Input";
// import Button from "../Button/Button"; // 버튼 제거

// Props 타입 정의: 검색 기준 변경 시 호출될 콜백 함수
interface MentorSearchProps {
  onCriteriaChange: (criteria: MentorSearchCriteria) => void;
}

const MentorSearch: FC<MentorSearchProps> = ({ onCriteriaChange }) => {
  const [techStack, setTechStack] = useState("");
  const [location, setLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // 검색 기준이 변경될 때마다 부모 컴포넌트로 알림
  // (디바운싱 적용 고려: 입력이 멈춘 후 일정 시간 뒤에만 호출)
  useEffect(() => {
    const criteria: MentorSearchCriteria = {
      techStack: techStack || undefined, // 빈 문자열이면 undefined
      location: location || undefined,
      price: {
        min: priceMin ? parseInt(priceMin) : undefined,
        max: priceMax ? parseInt(priceMax) : undefined,
      },
    };
    onCriteriaChange(criteria);
  }, [techStack, location, priceMin, priceMax, onCriteriaChange]);


  return (
    <div className={styles.searchContainer}>
      <h2>멘토 검색 조건</h2>
      <Input label="기술 스택" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="예: React"/>
      <Input label="활동 지역" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="예: 서울 강남구"/>
      <div className={styles.priceRange}>
        <Input label="가격 (최소)" type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="예: 30000"/>
        <Input label="가격 (최대)" type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="예: 50000"/>
      </div>
      {/* <Button onClick={handleSearch}>검색하기</Button> // 버튼 제거 */}
    </div>
  );
};

export default MentorSearch;