import React, { useState, FC } from "react";
import styles from "./CompanySearch.module.scss";
import { CompanySearchCriteria } from "../../types/types";
import Input from "../Input/Input"; // Input 컴포넌트 경로 확인
import Button from "../Button/Button"; // Button 컴포넌트 경로 확인

const CompanySearch: FC<{ onSearch: (criteria: CompanySearchCriteria) => void }> = ({ onSearch }) => {
  const [techStack, setTechStack] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    // 연봉 값이 숫자인지 확인하거나, 숫자 변환 로직 추가 고려 (API 요청 전)
    onSearch({ techStack, salary, location });
  };

  return (
    // styles.searchContainer에 modalSpecific 클래스 추가 (선택 사항)
    <div className={`${styles.searchContainer} ${styles.modalSpecific}`}> 
      {/* 모달 타이틀은 SearchModal 컴포넌트에서 이미 처리하므로 여기서는 제거하거나 유지 */}
      {/* <h2>회사 검색</h2> */}

      <Input
        label="기술 스택"
        value={techStack}
        onChange={(e) => setTechStack(e.target.value)}
        placeholder="예: Python, React (쉼표로 구분)" // 플레이스홀더 추가
      />

      {/* 연봉 입력 필드와 단위 표시를 위한 div 추가 */}
      <div className={styles.salaryInputWrapper}>
        <Input
          label="연봉 (만원)-선택" // 레이블에 단위 명시
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="숫자만 입력 (예: 3000)" // 플레이스홀더 추가
          // type="number" // Input 컴포넌트가 type prop을 지원한다면 사용 고려
        />
        {/* <span className={styles.salaryUnit}>만원</span> // 또는 레이블에만 명시 */}
      </div>

      <Input
        label="위치"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="예: 서울 강남구" // 플레이스홀더 추가
      />

      {/* primary prop을 Button 컴포넌트에 전달하여 강조 (Button 컴포넌트 구현에 따라 다름) */}
      <Button onClick={handleSearch} primary> 
        검색하기
      </Button>
    </div>
  );
};

export default CompanySearch;