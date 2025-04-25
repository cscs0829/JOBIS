import { useState, useRef, useEffect, useContext } from "react";
import ChatBox from "../components/Interview/ChatBox";
import InputAns from "../components/Interview/InputAns";
import styles from "./Interview.module.scss";
import { FC } from "react";
import { nameJobContext } from "../App";
import { NameJobContext } from "../types/types";
import { useNavigate } from "react-router-dom";
// import { Modes, mobileQuery } from "../constants/constants"; // 경로 확인
import { useSpring, animated } from "@react-spring/web";
import { useMediaQuery } from "react-responsive";
import { GiHamburgerMenu } from "react-icons/gi";
import Navbar from "../components/Interview/Navbar";
import ConfirmEndModal from "../components/Interview/ConfirmEndModal"; // <-- 모달 컴포넌트 import

const mobileQuery = "(max-width: 768px)"; // 임시 정의

const interviewAnimation = {
  from: {
    opacity: "0%", // 시작 투명도
    transform: "translateY(20px)", // 아래에서 위로
  },
  to: {
    opacity: "100%", // 최종 투명도
    transform: "translateY(0px)", // 최종 위치
  },
  config: { duration: 300 } // 애니메이션 시간 (ms)
};


const Interview: FC = () => {
  const restartToggle = useRef<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<string>("일반");
  const { name, job, interviewType } = useContext(
    nameJobContext
  ) as NameJobContext;
  const [messages, setMessages] = useState<{ content: string; role: string }[]>(
    []
  );
  const [ans, setAns] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const chatListRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // 오디오 상태 제거 또는 주석 처리

  const abortController = useRef<AbortController | null>(null);
  const isMount = useRef<boolean>(true);
  const navigate = useNavigate();
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: mobileQuery });

  // --- 면접 종료 관련 상태 추가 ---
  const [isEndConfirmModalOpen, setIsEndConfirmModalOpen] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  // ------------------------------

  const saveMessageToDB = async (
    intr_idx: number,
    talk_person: "interviewer" | "interviewee",
    talk_content: string
  ) => {
    // ... (기존 DB 저장 로직)
    try {
      await fetch("http://localhost:9000/interview/save-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intr_idx, talk_person, talk_content }),
      });
    } catch (err) {
      console.error("❌ 메시지 저장 실패:", err);
    }
  };

  const startInterviewSession = async () => {
    // ... (기존 세션 시작 로직)
    const storedMemId = localStorage.getItem("mem_id");
    try {
      const res = await fetch("http://localhost:9000/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: name,
          job,
          interviewType,
          mem_id: storedMemId,
        }),
      });
      const data = await res.json();
      setSessionId(data.session_id);
    } catch (err) {
      console.error("❌ 세션 시작 실패:", err);
    }
  };

  const handleStartInterview = async () => {
    // --- 면접 재시작 시 초기화 ---
    setInterviewEnded(false);
    setIsEndConfirmModalOpen(false);
    setMessages([]); // 메시지 목록 초기화
    // --------------------------

    await startInterviewSession();
    setSessionStarted(true);

    const systemPrompt = {
      role: "system",
      content: `
      [역할] 너는 ${name} 스타일의 AI 면접관 역할을 수행하고 있어.
      [상황] 지원자는 ${job} 직무에 지원했어.
      ${interviewType} 유형의 면접을 진행할거야.
      [규칙]
      2. 입장 클릭 시 바로 질문 시작, 인사말 금지
      3. 질문은 2문장 이내, 간결하게
      4. 사용자 답변 기반 꼬리질문
      5. 질문 5개 이내 제한
      [행동] 지금부터 첫 질문을 하세요.
      `,
    };

    setIsLoading(true); // 로딩 시작
    try {
      const res = await fetch("http://localhost:9000/interview/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: name,
          job,
          interviewType,
          selectedMode,
          messages: [systemPrompt], // 시스템 프롬프트만 포함
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const firstQuestion = { role: "assistant", content: data.reply };
      setMessages([systemPrompt, firstQuestion]); // 시스템 프롬프트와 첫 질문 설정

      if (sessionId) await saveMessageToDB(sessionId, "interviewer", data.reply); // 첫 질문 저장

      // TTS 요청 및 재생 (오류 처리 강화)
      const ttsRes = await fetch("http://localhost:9000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.reply }),
      });
      if (!ttsRes.ok) throw new Error(`TTS HTTP error! status: ${ttsRes.status}`);
      const ttsData = await ttsRes.json();
      const audio = new Audio(`http://localhost:9000${ttsData.audio_url}`);
      audio.play().catch(err => console.error("❌ 첫 질문 자동 재생 실패:", err));

    } catch (error) {
       console.error("❌ 첫 질문 받아오기 실패:", error);
       setMessages([{role: 'system', content: '면접관 연결에 실패했습니다. 다시 시도해주세요.'}]);
       setIsError(true); // 에러 상태 설정
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };


  const [springs, api] = useSpring(() => interviewAnimation);

  useEffect(() => {
    isMount.current = true;
    api.start(interviewAnimation);
    setNavbarToggle(false);
    // 컴포넌트 언마운트 시 AbortController 정리
    return () => {
        abortController.current?.abort();
        isMount.current = false; // 언마운트 상태 표시
    };
  }, [restartToggle.current, api]); // api 추가

  useEffect(() => {
    if (chatListRef.current !== null)
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = async (inputAns: string) => {
     if (!isMount.current || isLoading || isError || interviewEnded) return; // interviewEnded 조건 추가
     setIsLoading(true);
     isMount.current = false;

     const newUserMessage = { role: "user", content: inputAns };
     const updatedMessages = [...messages, newUserMessage];

     if (sessionId) await saveMessageToDB(sessionId, "interviewee", inputAns);

     setMessages(updatedMessages);
     setAns(""); // 입력창 비우기
     abortController.current = new AbortController();

     const storedMemId = localStorage.getItem("mem_id");

     try {
       const response = await fetch(
         "http://localhost:9000/interview/interview",
         {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             persona: name,
             job: job,
             interviewType: interviewType,
             selectedMode: selectedMode,
             mem_id: storedMemId, // 추가됨
             messages: updatedMessages,
           }),
           signal: abortController.current?.signal,
         }
       );
       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

       const data = await response.json();
       const assistantMessage = { role: "assistant", content: data.reply };
       setMessages((prevMessages) => [...prevMessages, assistantMessage]); // 이전 상태 기반 업데이트

       if (sessionId)
         await saveMessageToDB(sessionId, "interviewer", data.reply); // 응답 저장

        // TTS 요청 및 재생
        const ttsResponse = await fetch("http://localhost:9000/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: data.reply }),
        });
        if (!ttsResponse.ok) throw new Error(`TTS HTTP error! status: ${ttsResponse.status}`);
        const ttsData = await ttsResponse.json();
        const audio = new Audio(`http://localhost:9000${ttsData.audio_url}`);
        audio.play().catch(err => console.error("❌ TTS 재생 실패:", err));

     } catch (err: any) {
       if (err.name === 'AbortError') {
            console.log('Fetch aborted');
       } else {
           console.error("면접 중 오류 발생:", err);
           setIsError(true);
           setMessages(prev => [...prev, {role: 'system', content: '오류가 발생했습니다. 면접을 다시 시작해주세요.'}]);
       }
     } finally {
        if (isMount.current) { // 컴포넌트가 마운트된 상태일 때만 실행
           setIsLoading(false);
        }
     }
   };

  const handleChangeMode = (modeNum: number) => {
    restartToggle.current = !restartToggle.current;
    setMessages([]);
    setAns("");
    setIsError(false);
    setSessionStarted(false); // 세션 시작 상태 초기화
    setInterviewEnded(false); // 면접 종료 상태 초기화
    api.start(interviewAnimation); // 애니메이션 재시작
    // navigate(`/interview`); // 페이지 이동 대신 상태 초기화 및 애니메이션
  };

  // --- Navbar의 "면접 종료" 버튼 클릭 시 호출될 함수 ---
  const handleEndInterview = () => {
    setIsEndConfirmModalOpen(true); // 확인 모달 열기
  };

  // --- 모달에서 "네" 버튼 클릭 시 호출될 함수 ---
  const confirmEndInterview = () => {
    console.log("면접 종료 확인됨");
    // (Optional) API 호출: 백엔드에 면접 종료 알림 및 결과 요청
    // 예: fetch('/api/interview/end', { method: 'POST', body: JSON.stringify({ sessionId }) });

    setInterviewEnded(true); // 면접 종료 상태로 변경
    setIsEndConfirmModalOpen(false); // 모달 닫기
    abortController.current?.abort(); // 진행 중인 fetch 요청 중단
    setIsLoading(false); // 로딩 상태 해제
  };

  // --- "면접 결과 보기" 버튼 클릭 시 호출될 함수 ---
  const handleViewResults = () => {
    console.log("결과 보기 버튼 클릭됨");
    // 결과 페이지로 이동 또는 결과 데이터 로드 로직 구현
    // 예: navigate(`/interview/results/${sessionId}`);
    // 또는 fetch(...)해서 결과 표시
  };

  return (
    <animated.div style={springs} className={styles.Interview}>
      <div className={styles.interview_container}>
        <div className={styles.interview_left}>
          {/* Navbar에 onEndInterview prop 전달 */}
          <Navbar
            navbarToggle={navbarToggle}
            handleChangeMode={handleChangeMode}
            setNavbarToggle={setNavbarToggle}
            onEndInterview={handleEndInterview} // <-- prop 전달
          />
          {/* 모바일 햄버거 아이콘 (Navbar 외부로 이동 또는 Navbar 내부 유지 결정 필요) */}
           <div className={styles.title}> {/* title div 유지 */}
              {isMobile && (
                  <GiHamburgerMenu
                     className={styles.hamburgerIcon}
                     onClick={() => setNavbarToggle(!navbarToggle)}
                  />
              )}
           </div>
        </div>

        <div className={styles.interview_right}>
          <div className={styles.interview_right_wrapper}>
            {/* 면접 종료 상태가 아닐 때만 채팅 관련 UI 렌더링 */}
            {!interviewEnded && (
              <>
                <div
                  className={styles.chatList}
                  ref={chatListRef}
                  style={{
                    // 세션 시작 전/후 높이 조절
                    height: !sessionStarted ? "100%" : `calc(100% - ${isMobile ? '100px' : '80px'})`, // InputAns 높이 고려
                    overflowY: !sessionStarted ? "hidden" : "auto",
                  }}
                >
                  {/* 입장하기 버튼 */}
                  {!sessionStarted && (
                    <div className={styles.entryChat}>
                      <p className={styles.entryText}>{name || '지원자'}님 면접을 시작하겠습니다.</p>
                      <button
                        className={styles.enterButton}
                        onClick={handleStartInterview}
                        disabled={isLoading} // 시작 중 비활성화
                      >
                         {isLoading ? '준비중...' : '입장하기 ▶'}
                      </button>
                    </div>
                  )}

                  {/* 메시지 목록 */}
                  {sessionStarted &&
                    messages
                      .filter((it) => it.role !== "system") // 시스템 메시지 제외
                      .map((it, idx) => (
                        <ChatBox key={idx} text={it.content} role={it.role} />
                      ))}

                  {/* 로딩 스피너 */}
                  {isLoading && sessionStarted && ( // 세션 시작 후에만 로딩 표시
                    <div className={styles.loading}>
                      <div className={styles[`loading-text`]}>
                        면접관이 답변을 준비하고 있습니다
                      </div>
                      <img
                        width="30px"
                        src={`${process.env.PUBLIC_URL}/assets/Spinner2.gif`}
                        alt="Loading..."
                      />
                    </div>
                  )}
                </div>

                {/* 답변 입력 영역 (세션 시작 후에만 표시) */}
                {sessionStarted && (
                  <InputAns
                    ans={ans}
                    onClick={handleSubmit}
                    setAns={setAns}
                    isLoading={isLoading}
                    isError={isError}
                  />
                )}
              </>
            )}

            {/* 면접 종료 상태일 때 "면접 결과 보기" 버튼 렌더링 */}
            {interviewEnded && (
              <div className={styles.resultsContainer}> {/* 결과 버튼 컨테이너 추가 */}
                <button
                  className={styles.viewResultsButton}
                  onClick={handleViewResults}
                >
                  면접 결과 보기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

       {/* 오디오 컨트롤 제거 또는 주석 처리 */}
      {/* {audioUrl && (...)} */}

      {/* 면접 종료 확인 모달 */}
      <ConfirmEndModal
        isOpen={isEndConfirmModalOpen}
        onClose={() => setIsEndConfirmModalOpen(false)}
        onConfirm={confirmEndInterview}
      />
    </animated.div>
  );
};

export default Interview;