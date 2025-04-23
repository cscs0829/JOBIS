import React, { useState, useCallback } from "react"; // useState, useCallback import 확인
import styles from "./MentorRecommendation.module.scss";
import MentorNavbar, { MentorNavbarProps } from "../components/Mentor/MentorNavbar"; // Navbar import 확인
import MentorCard from "../components/Mentor/MentorCard";
import { Mentor, MentorSearchCriteria } from "../types/types";
import Button from "../components/Button/Button";
import AddMentorModal from "../components/Mentor/AddMentorModal";
import MentorSearchModal from "../components/Mentor/MentorSearchModal";
import { FaUserPlus, FaSearch } from "react-icons/fa"; // 아이콘 import 확인

const MentorRecommendation = () => {
  // --- 누락된 상태 변수 정의 추가 ---
  const [searchCriteria, setSearchCriteria] = useState<MentorSearchCriteria>({});
  const [searchResult, setSearchResult] = useState<Mentor[]>([]); // 검색 결과 상태
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false); // 멘토 추가 모달 상태
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // 검색 모달 상태
  // --------------------------------

  // --- 누락된 Navbar Props 정의 추가 ---
  // 실제 Navbar 기능 구현에 따라 selectedTab, handleTabChange 로직 필요
  const navbarProps: MentorNavbarProps = {
    selectedTab: 1, // 예시: 현재 '멘토 추천' 탭이 선택되었다고 가정
    handleTabChange: (tabIndex: number) => {
      console.log("Navbar Tab 변경:", tabIndex);
      // 실제 탭 변경 로직 구현 필요
    },
  };
  // ----------------------------------

  // --- 누락된 검색 실행 함수 정의 추가 ---
  const executeSearch = useCallback((criteria: MentorSearchCriteria) => {
    console.log("검색 실행:", criteria);
    // 실제 검색 로직 (API 호출 또는 필터링) ...
    const dummyData: Mentor[] = [ // 예시 데이터
        { id: 1, nickname: "멘토A", techStack: ["React", "Node.js"], location: "서울", price: { min: 30000, max: 50000 }, meetingType: '비대면', experience: '5년차', mentoringTopics: ["취업 상담", "포트폴리오 제작"], yearsExperience: "5~10년"},
        { id: 2, nickname: "멘토B", techStack: ["Vue.js", "Spring Boot"], location: "경기", company: "카카오", price: { min: 40000, max: 60000 }, meetingType: '대면', meetingLocation: '판교', experience: '전) 카카오', mentoringTopics: ["기술 심층 학습", "코드 리뷰"], yearsExperience: "5~10년"},
        { id: 3, nickname: "멘토C", techStack: ["Python", "Django"], location: "서울", price: { min: 20000, max: 40000 }, meetingType: '둘다가능', meetingLocation: '강남', experience: '3년차', mentoringTopics: ["사이드 프로젝트"], yearsExperience: "3~5년"},
    ];
    const filteredData = dummyData.filter(mentor => {
        const techStackMatch = criteria.techStack
          ? mentor.techStack.some(stack => stack.toLowerCase().includes(criteria.techStack!.toLowerCase()))
          : true;
        const locationMatch = criteria.location
          ? (mentor.location.includes(criteria.location) || (mentor.meetingLocation && mentor.meetingLocation.includes(criteria.location)))
          : true;
        const priceMinMatch = criteria.price?.min !== undefined
          ? mentor.price.max >= criteria.price.min
          : true;
        const priceMaxMatch = criteria.price?.max !== undefined
          ? mentor.price.min <= criteria.price.max
          : true;
        const meetingTypeMatch = criteria.meetingType
          ? mentor.meetingType === criteria.meetingType || (criteria.meetingType === '둘다가능' && (mentor.meetingType === '대면' || mentor.meetingType === '비대면'))
          : true;
        const mentoringTopicMatch = criteria.mentoringTopic && mentor.mentoringTopics
          ? mentor.mentoringTopics.includes(criteria.mentoringTopic)
          : true;
        const minYearsExperienceMatch = criteria.minYearsExperience !== undefined && mentor.yearsExperience
          ? (typeof mentor.yearsExperience === 'number' ? mentor.yearsExperience : parseInt(String(mentor.yearsExperience).match(/\d+/)?.[0] || '0')) >= criteria.minYearsExperience
          : true;
        return techStackMatch && locationMatch && priceMinMatch && priceMaxMatch && meetingTypeMatch && mentoringTopicMatch && minYearsExperienceMatch;
    });
    setSearchResult(filteredData);
  }, []);
  // ------------------------------------

  // --- 누락된 핸들러 함수 정의 추가 ---
  const handleSearchClick = () => { // 검색 버튼 클릭 시 검색 모달 열기
    setIsSearchModalOpen(true);
  };

  const handleApplySearch = useCallback((criteria: MentorSearchCriteria) => { // 검색 모달에서 '검색 적용' 시
    setSearchCriteria(criteria);
    setIsSearchModalOpen(false);
    executeSearch(criteria);
  }, [executeSearch]);

  const handleAddMentorClick = () => { // 멘토 추가 버튼 클릭 시 모달 열기
    setIsAddMentorModalOpen(true);
  };

  const handleCloseAddModal = () => { // 멘토 추가 모달 닫기
    setIsAddMentorModalOpen(false);
  };

  const handleCloseSearchModal = () => { // 검색 모달 닫기
    setIsSearchModalOpen(false);
  };

  const handleSaveMentor = (newMentorData: Omit<Mentor, 'id'>) => { // 멘토 추가 모달에서 '저장' 시
     console.log("새 멘토 정보 저장:", newMentorData);
     // API 호출 로직...
     const newMentor = { ...newMentorData, id: Date.now() }; // 임시 ID
     setSearchResult(prev => [...prev, newMentor]);
     handleCloseAddModal();
  };
  // ---------------------------------

  return (
    <div className={styles.companyMentorPage}>
      <div className={styles.companyMentorContainer}>
        <div className={styles.companyMentorLeft}>
          {/* 이제 navbarProps 가 정의되었으므로 오류 없음 */}
          <MentorNavbar {...navbarProps} />
        </div>
        <div className={styles.companyMentorRight}>
          {/* 검색 결과 표시 영역 */}
          <div className={styles.resultContainer}>
             {searchResult.length > 0 ? (
               searchResult.map(mentor => (
                 <MentorCard key={mentor.id} mentor={mentor} />
               ))
            ) : (
              <p className={styles.noResults}>멘토를 검색하거나 추가해보세요!</p>
            )}
          </div>

          {/* 하단 버튼 영역 */}
          <div className={styles.bottomButtonContainer}>
             {/* 이제 handleAddMentorClick 이 정의되었으므로 오류 없음 */}
            <Button onClick={handleAddMentorClick} className={styles.addMentorBtn}>
               <FaUserPlus style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              멘토 추가
            </Button>
            {/* 이제 handleSearchClick 이 정의되었으므로 오류 없음 */}
            <Button onClick={handleSearchClick} className={styles.searchBtn} >
               <FaSearch style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              검색하기
            </Button>
          </div>
        </div>
      </div>

      {/* 모달 렌더링 - 이제 props로 전달되는 변수/함수가 모두 정의됨 */}
      <AddMentorModal
        isOpen={isAddMentorModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveMentor}
      />
      <MentorSearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onSearch={handleApplySearch}
        initialCriteria={searchCriteria}
      />
    </div>
  );
};

export default MentorRecommendation;