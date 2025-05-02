import React, { useState, useCallback } from "react";
import styles from "./MentorRecommendation.module.scss";
import MentorNavbar, {
  MentorNavbarProps,
} from "../components/Mentor/MentorNavbar";
import MentorCard from "../components/Mentor/MentorCard";
import { Mentor, MentorSearchCriteria } from "../types/types";
import Button from "../components/Button/Button";
import AddMentorModal from "../components/Mentor/AddMentorModal";
import MentorSearchModal from "../components/Mentor/MentorSearchModal";
import { FaUserPlus, FaSearch } from "react-icons/fa";
import axios from "axios";

const MentorRecommendation = () => {
  const [searchCriteria, setSearchCriteria] = useState<MentorSearchCriteria>(
    {}
  );
  const [searchResult, setSearchResult] = useState<Mentor[]>([]);
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ 추가됨

  const navbarProps: MentorNavbarProps = {
    selectedTab: 1,
    handleTabChange: (tabIndex: number) => {
      console.log("Navbar Tab 변경:", tabIndex);
    },
  };

  const executeSearch = useCallback(
    async (criteria: MentorSearchCriteria) => {
      if (loading) return; // ✅ 중복 요청 방지
      setLoading(true);
      try {
        const query = [
          criteria.location,
          criteria.meetingType,
          criteria.mentoringTopic,
          criteria.minYearsExperience
            ? `${criteria.minYearsExperience}년 이상 경력`
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        console.log("🔥 최종 검색 쿼리:", query);

        const response = await axios.post(
          "http://localhost:9000/mentor-recommendation",
          {
            query: query,
          }
        );

        console.log("🎯 추천 결과:", response.data);

        if (response.data && response.data.recommended_mentors) {
          setSearchResult(response.data.recommended_mentors);
        } else {
          setSearchResult([]);
        }
      } catch (error) {
        console.error("❌ 멘토 추천 API 실패:", error);
        setSearchResult([]);
      } finally {
        setLoading(false); // ✅ 검색 끝나면 다시 false
      }
    },
    [loading]
  );

  const handleSearchClick = () => {
    if (loading) return; // ✅ 클릭 무시
    setIsSearchModalOpen(true);
  };

  const handleApplySearch = useCallback(
    (criteria: MentorSearchCriteria) => {
      setSearchCriteria(criteria);
      setIsSearchModalOpen(false);
      executeSearch(criteria);
    },
    [executeSearch]
  );

  const handleAddMentorClick = () => setIsAddMentorModalOpen(true);
  const handleCloseAddModal = () => setIsAddMentorModalOpen(false);
  const handleCloseSearchModal = () => setIsSearchModalOpen(false);

  const handleSaveMentor = (newMentorData: Omit<Mentor, "id">) => {
    const newMentor = { ...newMentorData, id: Date.now() };
    setSearchResult((prev) => [...prev, newMentor]);
    handleCloseAddModal();
  };

  return (
    <div className={styles.companyMentorPage}>
      <div className={styles.companyMentorContainer}>
        <div className={styles.companyMentorLeft}>
          <MentorNavbar {...navbarProps} />
        </div>
        <div className={styles.companyMentorRight}>
          <div className={styles.resultContainer}>
            {searchResult.length > 0 ? (
              searchResult.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))
            ) : (
              <p className={styles.noResults}>
                멘토를 검색하거나 추가해보세요!
              </p>
            )}
          </div>

          <div className={styles.bottomButtonContainer}>
            <Button
              onClick={handleAddMentorClick}
              className={styles.addMentorBtn}
            >
              <FaUserPlus
                style={{ marginRight: "6px", verticalAlign: "middle" }}
              />
              멘토 추가
            </Button>
            <Button
              onClick={handleSearchClick}
              className={styles.searchBtn}
              disabled={loading} // ✅ 버튼 비활성화
            >
              <FaSearch
                style={{ marginRight: "6px", verticalAlign: "middle" }}
              />
              {loading ? "추천 중..." : "검색하기"} {/* ✅ 로딩 중 표시 */}
            </Button>
          </div>
        </div>
      </div>

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
