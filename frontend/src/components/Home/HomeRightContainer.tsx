import styles from "./HomeRightContainer.module.scss";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { HomeRightContainerProps } from "../../types/types";
import { Transition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { nameJobContext } from "../../App";
import { NameJobContext } from "../../types/types";

const HomeRightContainer: FC<HomeRightContainerProps> = ({
  selectedMode,
  rightContainerRef,
}) => {
  const { name, setName, job, setJob } = useContext(
    nameJobContext
  ) as NameJobContext;

  // 마운트 시 이름과 직업 공백으로 초기화
  useEffect(() => {
    setName("");
    setJob("");
  }, []);

  const navigator = useNavigate();

  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputJobRef = useRef<HTMLInputElement>(null);
  const [inputNotice, setInputNotice] = useState<boolean>(false);

  const handleInterviewStart = () => {
    if (name.length === 0 && inputNameRef.current) {
      inputNameRef.current.focus();
      setInputNotice(true);
      return;
    }
    if (job.length === 0 && inputJobRef.current) {
      inputJobRef.current.focus();
      setInputNotice(true);
      return;
    }

    navigator(`/interview/${selectedMode}`);
  };

  const handleGoToAiJasoseo = () => {
    navigator("/ai-jasoseo");
  };

  const handleGoToAiGuide = () => {
    navigator("/ai-guide");
  };

  return (
    <Transition in={selectedMode !== -1} timeout={500}>
      {(state: any) => (
        <div
          ref={rightContainerRef}
          className={`${styles.HomeRightContainer} ${styles[state]}`}
        >
          {selectedMode === 0 && (
            // AI 면접 서비스의 키는 0입니다.
            <>
              <h3>원하시는 면접을 설정해보세요</h3>
              <div className={styles.input_user_info_box}>
                <div className={styles.info_wrapper}>
                  <h4>면접관 페르소나</h4>
                  <input
                    ref={inputNameRef}
                    type="text"
                    placeholder="예: 까칠한 면접관, 꼬리물기 면접관"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && inputJobRef.current)
                        inputJobRef.current.focus();
                    }}
                  />
                  {inputNotice && name.length === 0 && (
                    <div className={styles.notice_text}>
                      면접관 페르소나를 입력해주세요
                    </div>
                  )}
                </div>

                <div className={styles.info_wrapper}>
                  <h4>직무</h4>
                  <input
                    ref={inputJobRef}
                    type="text"
                    placeholder="직무를 입력하세요"
                    value={job}
                    onChange={(e) => {
                      setJob(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleInterviewStart();
                    }}
                  />
                  {inputNotice && job.length === 0 && (
                    <div className={styles.notice_text}>직무를 입력해주세요</div>
                  )}
                </div>

                <div className={styles.info_wrapper}>
                  <h4>면접 유형</h4>
                  <input
                    type="text"
                    placeholder="예: 기술면접, 인성면접"
                    // 상태값이 없으므로 별도 useState 필요
                    onChange={() => {}}
                  />
                  {/* 유효성 검사 메시지는 원하시면 추가 가능 */}
                </div>

                <button onClick={handleInterviewStart}>면접 시작</button>
              </div>
            </>
          )}

          {selectedMode === 1 && (
            // AI 자소서 도우미의 키는 1입니다.
            <>
              <h3>AI 자소서 도우미</h3>
              <div className={styles.input_user_info_box}>
                <button onClick={handleGoToAiJasoseo}>자소서 초안 작성</button>
                <button onClick={handleGoToAiGuide}>
                  자소서 가이드
                </button>
              </div>
            </>
          )}

          {selectedMode === 2 && (
            // 회사 / 멘토 추천의 키는 2입니다.
            <>
              <h3>회사 / 멘토 추천</h3>
              <div className={styles.input_user_info_box}>
                <button onClick={() => alert("회사 추천 기능")}>회사 추천</button>
                <button onClick={() => alert("멘토 추천 기능")}>멘토 추천</button>
              </div>
            </>
          )}
        </div>
      )}
    </Transition>
  );
};

export default HomeRightContainer;