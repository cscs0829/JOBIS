import React, {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import styles from "./HomeRightContainer.module.scss";
import {
  HomeRightContainerProps,
} from "../../types/types";
import { Transition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { nameJobContext } from "../../App";
import { NameJobContext } from "../../types/types";
// import PersonaSelectModal from "./PersonaSelectModal"; // 제거
// import JobSelectModal from "./JobSelectModal"; // 제거

const HomeRightContainer: FC<HomeRightContainerProps> = ({
  selectedMode,
  rightContainerRef,
  selectedPersona,
  onSelectPersona,
  openJobModal,
  selectedJob,
  setJob,
  selectedInterviewType,
  setInterviewType,
  openPersonaModal, // 이름 변경
  selectJob,
  handleJobInputChange,
  jobInputValue,
}) => {
  const { name, setName, job, setJob: setJobFromContext, interviewType, setInterviewType: setInterviewTypeFromContext } =
    useContext(nameJobContext) as NameJobContext;

  const navigator = useNavigate();
  const inputJobRef = useRef<HTMLInputElement>(null);
  const [inputNotice, setInputNotice] = useState<boolean>(false);
  const [isPersonaButtonSelected, setIsPersonaButtonSelected] = useState<boolean>(false);
  const [isJobButtonSelected, setIsJobButtonSelected] = useState<boolean>(false);

  useEffect(() => {
    setName(selectedPersona || "");
    setJobFromContext(selectedJob || "");
    setInterviewTypeFromContext(selectedInterviewType || "");
  }, [selectedPersona, selectedJob, selectedInterviewType]);

  const handlePersonaButtonClick = () => {
    openPersonaModal(); // 이름 변경
    setIsPersonaButtonSelected(true);
  };

  const handleJobButtonClick = () => {
    openJobModal();
    setIsJobButtonSelected(true);
  };

  const handleInterviewStart = () => {
    if (!selectedPersona) {
      openPersonaModal(); // 이름 변경
      return;
    }
    if (!selectedJob) {
      openJobModal();
      return;
    }
    if (!selectedInterviewType) {
      setInputNotice(true);
      return;
    }

    navigator(`/interview`);
  };

  const handleGoToAiJasoseo = () => {
    navigator("/ai-jasoseo");
  };

  const handleGoToAiGuide = () => {
    navigator("/ai-feedback");
  };

  const handleGoToCompanyRecommendation = () => {
    navigator("/company-recommendation");
  };

  const handleGoToMentorRecommendation = () => {
    navigator("/mentor-recommendation");
  };

  const handleInterviewTypeClick = (type: string) => {
    setInterviewType(type);
    setInputNotice(false);
  };

  return (
    <Transition in={selectedMode !== -1} timeout={500}>
      {(state: any) => (
        <div
          ref={rightContainerRef}
          className={`${styles.HomeRightContainer} ${styles[state]}`}
        >
          {selectedMode === 0 && (
            <>
              <h3>원하시는 면접을 설정해보세요</h3>
              <div className={styles.input_user_info_box}>
                {/* 면접관 페르소나 선택 버튼 */}
                <div className={styles.persona_select_box}>
                  <h4>면접관 페르소나</h4>
                  <button
                    className={`${styles.select_button} ${isPersonaButtonSelected ? styles.selected_button : ""}`}
                    onClick={handlePersonaButtonClick}
                  >
                    면접관 페르소나 선택
                  </button>
                  {selectedPersona && (
                    <div>선택된 페르소나: {selectedPersona}</div>
                  )}
                </div>

                {/* 직무 선택 버튼 */}
                <div className={styles.job_select_box}>
                  <h4>직무</h4>
                  <button
                    className={`${styles.select_button} ${isJobButtonSelected ? styles.selected_button : ""}`}
                    onClick={handleJobButtonClick}
                  >
                    직무 선택
                  </button>
                  {selectedJob && <div>선택된 직무: {selectedJob}</div>}
                </div>

                {/* 면접 유형 선택 UI */}
                <div>
                  <h4>면접 유형</h4>
                  <div className={styles.interviewTypeButtons}>
                    <button
                      className={
                        selectedInterviewType === "기술 면접"
                          ? styles.selected
                          : styles.unselected
                      }
                      onClick={() => handleInterviewTypeClick("기술 면접")}
                    >
                      기술 면접
                    </button>
                    <button
                      className={
                        selectedInterviewType === "인성 면접"
                          ? styles.selected
                          : styles.unselected
                      }
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

                <button onClick={handleInterviewStart}>면접 시작</button>
              </div>
            </>
          )}

          {selectedMode === 1 && (
            <>
              <h3>AI 자소서 도우미</h3>
              <div className={styles.input_user_info_box}>
                <button onClick={handleGoToAiJasoseo}>자소서 초안 작성</button>
                <button onClick={handleGoToAiGuide}>자소서 가이드</button>
              </div>
            </>
          )}

          {selectedMode === 2 && (
            <>
              <h3>회사 / 멘토 추천</h3>
              <div className={styles.input_user_info_box}>
                <button onClick={handleGoToCompanyRecommendation}>
                  회사 추천
                </button>
                <button onClick={handleGoToMentorRecommendation}>
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