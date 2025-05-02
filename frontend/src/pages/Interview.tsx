// src/pages/Interview.tsx
import React, { useState, useRef, useEffect, useContext } from "react";
import ChatBox from "../components/Interview/ChatBox";
import InputAns from "../components/Interview/InputAns";
import styles from "./Interview.module.scss";
import { FC } from "react";
import { nameJobContext } from "../App";
import { NameJobContext } from "../types/types";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { mobileQuery } from "../constants/constants";
import { useSpring, animated } from "@react-spring/web";
import { useMediaQuery } from "react-responsive";
import { GiHamburgerMenu } from "react-icons/gi";
import Navbar from "../components/Interview/Navbar";
import API_BASE_URL from "../constants/api";
import STTRecorder from "../components/STTRecorder";

// --- 모달 컴포넌트 ---
interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const ResultModal: FC<ResultModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1001,
  };

  const modalContentStyle: React.CSSProperties = {
    background: "white",
    padding: "20px 30px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const buttonStyle: React.CSSProperties = {
    margin: "15px 10px 0",
    padding: "10px 20px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    fontSize: "0.95rem",
    fontWeight: "500",
  };

  const confirmButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#ff9500", // $main-color 유사 색상
    color: "white",
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#ccc",
    color: "#333",
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <p style={{ marginBottom: "10px", fontSize: "1.1rem", color: "#333" }}>
          면접이 종료되었습니다.
          <br />
          결과를 보시겠습니까?
        </p>
        <button style={confirmButtonStyle} onClick={onConfirm}>
          예
        </button>
        <button style={cancelButtonStyle} onClick={onClose}>
          아니오
        </button>
      </div>
    </div>
  );
};
// --- 모달 컴포넌트 끝 ---

const interviewAnimation = {
  from: {
    width: "0%",
    opacity: "0%",
    transform: "rotate(270deg) scale(0)",
  },
  to: {
    width: "100%",
    opacity: "100%",
    transform: "rotate(360deg) scale(1)",
  },
};

const Interview: FC = () => {
  const restartToggle = useRef<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<string>("일반");
  const { name, job, interviewType } = useContext(
    nameJobContext
  ) as NameJobContext;
  const { userInfo } = useAuth();
  const [messages, setMessages] = useState<{ content: string; role: string }[]>(
    []
  );
  const [ans, setAns] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const chatListRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsDone, setTtsDone] = useState<boolean>(false);

  const abortController = useRef<AbortController | null>(null);
  const isMount = useRef<boolean>(true);
  const navigate = useNavigate();
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);

  const isMobile = useMediaQuery({ query: mobileQuery });

  const [isInterviewFinished, setIsInterviewFinished] =
    useState<boolean>(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);

  const saveMessageToDB = async (
    intr_idx: number,
    talk_person: "interviewer" | "interviewee",
    talk_content: string
  ) => {
    try {
      await fetch(`${API_BASE_URL}/interview/save-detail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intr_idx, talk_person, talk_content }),
      });
    } catch (err) {
      console.error("❌ 메시지 저장 실패:", err);
    }
  };

  // ========== startInterviewSession 함수: sessionId 반환 ==========
  const startInterviewSession = async (): Promise<number | null> => {
    const storedMemId = localStorage.getItem("mem_id") || userInfo?.id;
    if (!storedMemId) {
      console.error("❌ 사용자 ID를 찾을 수 없습니다.");
      setIsError(true);
      return null;
    }
    try {
      console.log("🚀 /interview/start 요청 시작:", {
        persona: name,
        job,
        interviewType,
        selectedMode,
        mem_id: storedMemId,
        messages: [],
      });
      const res = await fetch(`${API_BASE_URL}/interview/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: name,
          job,
          interviewType,
          selectedMode,
          mem_id: storedMemId,
          messages: [],
        }),
      });

      if (!res.ok) {
        if (res.status === 422) {
          const errorData = await res.json();
          console.error("❌ 422 Unprocessable Entity:", errorData);
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const receivedSessionId = data.session_id;
      setSessionId(receivedSessionId); // 상태 업데이트
      console.log("✅ 세션 시작 성공, ID:", receivedSessionId);
      return receivedSessionId; // sessionId 반환
    } catch (err) {
      console.error("❌ 세션 시작 실패:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  // =============================================================

  // ========== handleStartInterview 함수: await 및 반환값 사용 ==========
  const handleStartInterview = async () => {
    setIsLoading(true);
    setIsError(false);

    const storedMemId = localStorage.getItem("mem_id") || userInfo?.id;
    if (!storedMemId) {
      setIsError(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/interview/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: name,
          job,
          interviewType,
          selectedMode,
          mem_id: storedMemId,
          messages: [],
        }),
      });
      const data = await res.json();
      const receivedSessionId = data.session_id;
      setSessionId(receivedSessionId);
      setSessionStarted(true);

      const systemPrompt = {
        role: "system",
        content: `
        [역할] 너는 ${name} 스타일의 AI 면접관 역할을 수행하고 있어.
        [상황] 지원자는 ${job} 직무에 지원했어.
        ${interviewType} 유형의 면접을 진행할거야.
        [규칙]
        1. 면접관 페르소나(${name})를 일관되게 유지해줘.
        2. 입장 클릭 시 바로 질문 시작, 인사말 금지
        3. 질문은 2문장 이내, 간결하게
        4. 총 5개의 질문만 하고, 마지막 질문 후에는 "면접이 종료되었습니다." 라는 메시지만 정확히 출력해줘.
        5. 다른 추가적인 말 없이 면접 종료 메시지만 출력해야 해.
        [행동] 지금부터 첫 질문을 하세요.
        `,
      };

      const interviewRes = await fetch(`${API_BASE_URL}/interview/interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: name,
          job,
          interviewType,
          selectedMode,
          messages: [systemPrompt],
        }),
      });
      const interviewData = await interviewRes.json();
      const firstQuestion = interviewData.reply;

      setMessages([
        systemPrompt,
        { role: "assistant", content: firstQuestion },
      ]);

      // TTS 실행 후 STT 시작
      const ttsRes = await fetch(`${API_BASE_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: firstQuestion }),
      });
      const ttsData = await ttsRes.json();
      const audio = new Audio(`${API_BASE_URL}${ttsData.audio_url}`);
      await audio.play();
      audio.onended = () => {
        setTtsDone(true);
      };
    } catch (err) {
      console.log("면접 시작 실패:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  // =================================================================

  const [springs, api] = useSpring(() => interviewAnimation);

  useEffect(() => {
    isMount.current = true;
    api.start(interviewAnimation);
    setNavbarToggle(false);
    setIsInterviewFinished(false);
    setIsResultModalOpen(false);
    setSessionStarted(false);
    setMessages([]);
    // setSessionId(null);
    setIsError(false);
    return () => {
      abortController.current?.abort();
      isMount.current = false;
    };
  }, [restartToggle.current]);

  useEffect(() => {
    if (chatListRef.current !== null)
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = async (inputAns: string) => {
    const currentSessionId = sessionId; // 현재 sessionId 상태 값 사용

    if (!isMount.current && (isLoading || isError)) return;
    setIsLoading(true);
    isMount.current = false;

    const updatedMessages = [...messages, { role: "user", content: inputAns }];

    if (currentSessionId)
      await saveMessageToDB(currentSessionId, "interviewee", inputAns);
    else
      console.warn("⚠️ [handleSubmit] 세션 ID가 없어 사용자 답변 DB 저장 실패");

    setMessages(updatedMessages);
    setAns("");
    abortController.current = new AbortController();

    const storedMemId = localStorage.getItem("mem_id") || userInfo?.id;

    try {
      const response = await fetch(`${API_BASE_URL}/interview/interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: name,
          job,
          interviewType,
          selectedMode,
          mem_id: storedMemId, // mem_id 추가
          messages: updatedMessages,
        }),
        signal: abortController.current?.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.reply === "면접이 종료되었습니다.") {
        const assistantMessage = { role: "assistant", content: data.reply };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);

        if (currentSessionId)
          await saveMessageToDB(currentSessionId, "interviewer", data.reply);

        setIsInterviewFinished(true);
        setIsResultModalOpen(true);
        setIsLoading(false);
        return;
      }

      const assistantMessage = { role: "assistant", content: data.reply };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      if (currentSessionId)
        await saveMessageToDB(currentSessionId, "interviewer", data.reply);
      else
        console.warn(
          "⚠️ [handleSubmit] 세션 ID가 없어 면접관 답변 DB 저장 실패"
        );

      // TTS 로직
      const ttsResponse = await fetch(`${API_BASE_URL}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.reply }),
      });

      if (!ttsResponse.ok) {
        console.warn("⚠️ TTS 요청 실패:", ttsResponse.status);
      } else {
        const ttsData = await ttsResponse.json();
        const audioUrl = `${API_BASE_URL}${ttsData.audio_url}`;
        setAudioUrl(audioUrl);
        const audio = new Audio(audioUrl);

        try {
          await audio.play();
          console.log("TTS 자동 재생 성공");
        } catch (err) {
          console.error("TTS 자동 생성");
        }

        setAudioUrl(`${API_BASE_URL}${ttsData.audio_url}`);
        audio
          .play()
          .catch((err) => console.error("❌ TTS 자동 재생 실패:", err));
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("면접 진행 중 오류 발생:", err);
        setIsError(true);
      }
    } finally {
      if (!isInterviewFinished) {
        setIsLoading(false);
      }
    }
  };

  const handleChangeMode = (modeNum: Number) => {
    restartToggle.current = !restartToggle.current;
    navigate(`/interview`);
  };

  const handleConfirmModal = () => {
    setIsResultModalOpen(false);
    if (sessionId) {
      navigate(`/interview-feedback/${sessionId}`);
    } else {
      console.error("❌ 세션 ID가 없어 결과 페이지로 이동할 수 없습니다.");
      navigate("/");
    }
  };

  const handleCloseModal = () => {
    setIsResultModalOpen(false);
  };

  return (
    <animated.div style={springs} className={styles.Interview}>
      <div className={styles.interview_container}>
        {/* Left Section */}
        <div className={styles.interview_left}>
          <div className={styles.title}>
            {isMobile && (
              <GiHamburgerMenu
                className={styles.hamburgerIcon}
                onClick={() => setNavbarToggle(!navbarToggle)}
              />
            )}
            {isMobile && <h2>AI 면접</h2>}
          </div>
          <Navbar
            navbarToggle={navbarToggle}
            handleChangeMode={handleChangeMode}
            setNavbarToggle={setNavbarToggle}
          />
        </div>

        {/* Right Section */}
        <div className={styles.interview_right}>
          <div className={styles.interview_right_wrapper}>
            <div
              className={styles.chatList}
              ref={chatListRef}
              style={{
                height: !sessionStarted ? "100%" : "calc(100% - 80px)",
                overflowY: !sessionStarted ? "hidden" : "auto",
              }}
            >
              {/* 면접 시작 전 */}
              {!sessionStarted && (
                <div className={styles.entryChat}>
                  <p className={styles.entryText}>
                    {userInfo?.nickname || "면접자"}님 입장해주세요.
                  </p>
                  <button
                    className={styles.enterButton}
                    onClick={handleStartInterview}
                    disabled={isLoading}
                  >
                    {isLoading ? "준비 중..." : "입장하기 ▶"}
                  </button>
                  {isError && (
                    <p style={{ color: "red", marginTop: "10px" }}>
                      오류가 발생했습니다. 다시 시도해주세요.
                    </p>
                  )}
                </div>
              )}

              {/* 면접 진행 중 */}
              {sessionStarted &&
                messages
                  .filter((it) => it.role !== "system")
                  .map((it, idx) => (
                    <ChatBox key={idx} text={it.content} role={it.role} />
                  ))}

              {/* 로딩 */}
              {sessionStarted && isLoading && (
                <div className={styles.loading}>
                  <div className={styles[`loading-text`]}>
                    면접관이 답변을 준비하고 있습니다
                  </div>
                  <img
                    alt="로딩 스피너"
                    width="30px"
                    src={`${process.env.PUBLIC_URL}/assets/Spinner2.gif`}
                  />
                </div>
              )}

              {/* 에러 */}
              {sessionStarted && isError && !isLoading && (
                <ChatBox
                  text="오류가 발생했습니다. 면접을 다시 시작해주세요."
                  role="assistant"
                />
              )}
            </div>

            {/* 답변 입력 */}
            {sessionStarted && !isInterviewFinished && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <InputAns
                  ans={ans}
                  onClick={handleSubmit}
                  setAns={setAns}
                  isLoading={isLoading}
                  isError={isError}
                />

                {/* STTRecorder: 음성 녹음 결과를 ans 상태에 넣음 */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <STTRecorder
                    trigger={ttsDone}
                    onTranscribed={(text) => setAns(text)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 결과 모달 */}
      <ResultModal
        isOpen={isResultModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
    </animated.div>
  );
};

export default Interview;
