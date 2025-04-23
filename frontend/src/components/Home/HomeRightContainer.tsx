import React, {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./HomeRightContainer.module.scss";
import {
  HomeRightContainerProps,
  NameJobContext, // 중복 제거
} from "../../types/types";
import { Transition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { nameJobContext } from "../../App";

const HomeRightContainer: FC<HomeRightContainerProps> = ({
  selectedMode,
  rightContainerRef,
  selectedPersona,
  // onSelectPersona, // props에서 제거됨 (context 사용)
  openJobModal,
  selectedJob,
  // setJob, // props에서 제거됨 (context 사용)
  selectedInterviewType,
  setInterviewType, // 상태 직접 업데이트 함수 유지
  openPersonaModal,
  // selectJob, // props에서 제거됨 (context 사용)
  // handleJobInputChange, // props에서 제거됨 (JobSelectModal 내부 처리 가정)
  // jobInputValue, // props에서 제거됨 (JobSelectModal 내부 처리 가정)
}) => {
  // Context에서 필요한 상태와 함수 가져오기
  const { name, setName, job, setJob: setJobFromContext, interviewType, setInterviewType: setInterviewTypeFromContext } =
    useContext(nameJobContext) as NameJobContext;

  const navigator = useNavigate();
  const [inputNotice, setInputNotice] = useState<boolean>(false);
  // 버튼 선택 상태 추적 (선택 시 selected 클래스 적용 위함)
  const [isPersonaButtonSelected, setIsPersonaButtonSelected] = useState<boolean>(!!selectedPersona);
  const [isJobButtonSelected, setIsJobButtonSelected] = useState<boolean>(!!selectedJob);

  // Context 상태 업데이트 (selectedPersona, selectedJob 변경 시)
  useEffect(() => {
    setName(selectedPersona || "");
  }, [selectedPersona, setName]);

  useEffect(() => {
    setJobFromContext(selectedJob || "");
  }, [selectedJob, setJobFromContext]);

  // Context 상태 업데이트 (selectedInterviewType 변경 시)
  // HomeRightContainer 내부 상태(selectedInterviewType)와 Context 상태 동기화
  useEffect(() => {
    setInterviewTypeFromContext(selectedInterviewType || "");
  }, [selectedInterviewType, setInterviewTypeFromContext]);


  // 모달 열기 함수들
  const handlePersonaButtonClick = () => {
    openPersonaModal();
    setIsPersonaButtonSelected(true); // 버튼 클릭 시 일단 선택된 것처럼 보이게 처리
  };

  const handleJobButtonClick = () => {
    openJobModal();
    setIsJobButtonSelected(true); // 버튼 클릭 시 일단 선택된 것처럼 보이게 처리
  };

  // 면접 시작 핸들러
  const handleInterviewStart = () => {
    if (!selectedPersona) {
      handlePersonaButtonClick(); // 페르소나 선택 유도
      return;
    }
    if (!selectedJob) {
      handleJobButtonClick(); // 직무 선택 유도
      return;
    }
    if (!selectedInterviewType) {
      setInputNotice(true); // 면접 유형 선택 알림 표시
      return;
    }

    // 모든 조건 만족 시 면접 페이지로 이동
    navigator(`/interview`);
  };

  // 페이지 이동 핸들러들
  const handleGoToAiJasoseo = () => {
    navigator("/ai-jasoseo");
  };

  const handleGoToAiFeedback = () => { // 함수 이름 변경 (ai-guide -> ai-feedback)
    navigator("/ai-feedback");
  };

  const handleGoToCompanyRecommendation = () => {
    navigator("/company-recommendation");
  };

  const handleGoToMentorRecommendation = () => {
    navigator("/mentor-recommendation");
  };

  // 면접 유형 선택 핸들러
  const handleInterviewTypeClick = (type: string) => {
    setInterviewType(type); // 내부 상태 업데이트
    setInputNotice(false); // 알림 숨기기
  };

  // selectedPersona 또는 selectedJob 값이 변경될 때 버튼 선택 상태 업데이트
  useEffect(() => {
    setIsPersonaButtonSelected(!!selectedPersona);
  }, [selectedPersona]);

  useEffect(() => {
    setIsJobButtonSelected(!!selectedJob);
  }, [selectedJob]);


  return (
    <Transition in={selectedMode !== -1} timeout={400}>
      {(state: string) => ( // state 타입 명시
        <div
          ref={rightContainerRef}
          className={`${styles.HomeRightContainer} ${styles[state]}`}
        >
          {/* --- AI 면접 모드 --- */}
          {selectedMode === 0 && (
            <>
              <h3>원하시는 면접을 설정해보세요</h3>
              <div className={styles.input_user_info_box}>

                {/* 면접관 페르소나 선택 섹션 */}
                <div className={styles.select_section}>
                  <h4>면접관 페르소나</h4>
                  <button
                    className={`${styles.select_button} ${isPersonaButtonSelected ? styles.selected_button : ""}`}
                    onClick={handlePersonaButtonClick}
                  >
                    {selectedPersona ? `선택됨: ${selectedPersona}` : "면접관 페르소나 선택"}
                  </button>
                  {/* 선택된 값 표시 제거 (버튼 내부에 표시) */}
                </div>

                {/* 직무 선택 섹션 */}
                <div className={styles.select_section}>
                  <h4>직무</h4>
                  <button
                    className={`${styles.select_button} ${isJobButtonSelected ? styles.selected_button : ""}`}
                    onClick={handleJobButtonClick}
                  >
                    {selectedJob ? `선택됨: ${selectedJob}` : "직무 선택"}
                  </button>
                   {/* 선택된 값 표시 제거 (버튼 내부에 표시) */}
                </div>

                {/* 면접 유형 선택 섹션 */}
                <div className={styles.select_section}>
                  <h4>면접 유형</h4>
                  <div className={styles.interviewTypeButtons}>
                    <button
                      className={selectedInterviewType === "기술 면접" ? styles.selected : ""}
                      onClick={() => handleInterviewTypeClick("기술 면접")}
                    >
                      기술 면접
                    </button>
                    <button
                      className={selectedInterviewType === "인성 면접" ? styles.selected : ""}
                      onClick={() => handleInterviewTypeClick("인성 면접")}
                    >
                      인성 면접
                    </button>
                  </div>
                  {inputNotice && !selectedInterviewType && (
                    <div className={styles.notice_text}>
                      면접 유형을 선택해주세요
                    </div>
                  )}
                </div>

                {/* 면접 시작 버튼 */}
                <button className={styles.action_button} onClick={handleInterviewStart}>
                  면접 시작
                </button>
              </div>
            </>
          )}

          {/* --- AI 자소서 모드 --- */}
          {selectedMode === 1 && (
            <>
              <h3>AI 자소서 도우미</h3>
              <div className={styles.input_user_info_box}>
                 {/* 버튼에 action_button 스타일 적용 */}
                <button className={styles.action_button} onClick={handleGoToAiJasoseo}>
                  자소서 초안 작성
                </button>
                <button className={styles.action_button} onClick={handleGoToAiFeedback}>
                  자소서 피드백/가이드
                </button>
              </div>
            </>
          )}

          {/* --- 회사/멘토 추천 모드 --- */}
          {selectedMode === 2 && (
            <>
              <h3>회사 / 멘토 추천</h3>
              <div className={styles.input_user_info_box}>
                 {/* 버튼에 action_button 스타일 적용 */}
                <button className={styles.action_button} onClick={handleGoToCompanyRecommendation}>
                  회사 추천
                </button>
                <button className={styles.action_button} onClick={handleGoToMentorRecommendation}>
                  멘토 추천
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Transition>
  );
};

export default HomeRightContainer;