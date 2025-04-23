import { useState, useRef, useEffect, useContext } from "react";
import ChatBox from "../components/Interview/ChatBox";
import InputAns from "../components/Interview/InputAns";
import styles from "./Interview.module.scss";
import { FC } from "react";
import { nameJobContext } from "../App";
import { NameJobContext } from "../types/types";

import { useNavigate } from "react-router-dom";
import { Modes, mobileQuery } from "../constants/constants";
import { useSpring, animated } from "@react-spring/web";
import { useMediaQuery } from "react-responsive";
import { GiHamburgerMenu } from "react-icons/gi";
import Navbar from "../components/Interview/Navbar";

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

  const abortController = useRef<AbortController | null>(null);
  const isMount = useRef<boolean>(true);
  const navigate = useNavigate();
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);

  const isMobile = useMediaQuery({ query: mobileQuery });

  const saveMessageToDB = async (
    intr_idx: number,
    talk_person: "interviewer" | "interviewee",
    talk_content: string
  ) => {
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

    // 👇 첫 질문 받아오기
    const res = await fetch("http://localhost:9000/interview/interview", {
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
    const data = await res.json();
    const firstQuestion = { role: "assistant", content: data.reply };
    setMessages([systemPrompt, firstQuestion]);

    // ✅ 이 시점에 TTS 요청 → 오디오 생성 → 재생까지 '동기적으로' 진행
    const ttsRes = await fetch("http://localhost:9000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: data.reply }),
    });
    const ttsData = await ttsRes.json();
    const audioUrl = `http://localhost:9000${ttsData.audio_url}`;
    const audio = new Audio(audioUrl);
    audio.autoplay = true;
    audio.muted = false;

    // 🎯 클릭 이벤트 핸들러 안에서 직접 재생
    try {
      await audio.play();
      console.log("✅ 자동 재생 성공");
    } catch (err) {
      console.error("❌ 자동 재생 실패:", err);
    }
  };

  const [springs, api] = useSpring(() => interviewAnimation);

  useEffect(() => {
    isMount.current = true;
    api.start(interviewAnimation);
    setNavbarToggle(false);
    return () => abortController.current?.abort();
  }, [restartToggle.current]);

  useEffect(() => {
    if (chatListRef.current !== null)
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = async (inputAns: string) => {
    if (!isMount.current && (isLoading || isError)) return;
    setIsLoading(true);
    isMount.current = false;

    const updatedMessages = [...messages, { role: "user", content: inputAns }];
    if (sessionId) await saveMessageToDB(sessionId, "interviewee", inputAns);

    setMessages(updatedMessages);
    setAns("");
    abortController.current = new AbortController();

    const storedMemId = localStorage.getItem("mem_id"); // 여기 추가

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
            mem_id: storedMemId,
            messages: updatedMessages,
          }),
          signal: abortController.current?.signal,
        }
      );

      const data = await response.json();
      const assistantMessage = { role: "assistant", content: data.reply };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      if (sessionId)
        await saveMessageToDB(sessionId, "interviewer", data.reply);

      const ttsResponse = await fetch("http://localhost:9000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.reply }),
      });
      const ttsData = await ttsResponse.json();
      const audio = new Audio(`http://localhost:9000${ttsData.audio_url}`);
      audio.play();
    } catch (err) {
      console.error("면접 중 오류 발생:", err);
      setIsError(true);
    }
    setIsLoading(false);
  };

  const handleChangeMode = (modeNum: Number) => {
    restartToggle.current = !restartToggle.current;
    setMessages([]);
    setAns("");
    setIsError(false);
    navigate(`/interview`);
  };

  return (
    <animated.div style={springs} className={styles.Interview}>
      <div className={styles.interview_container}>
        <div className={styles.interview_left}>
          <div className={styles.title}>
            {isMobile && (
              <GiHamburgerMenu
                className={styles.hamburgerIcon}
                onClick={() => setNavbarToggle(!navbarToggle)}
              />
            )}
          </div>
          <Navbar
            navbarToggle={navbarToggle}
            handleChangeMode={handleChangeMode}
            setNavbarToggle={setNavbarToggle}
          />
        </div>

        <div className={styles.interview_right}>
          <div className={styles.interview_right_wrapper}>
            <div
              className={styles.chatList}
              ref={chatListRef}
              style={{
                height: !sessionStarted ? "100%" : "85%",
                overflowY: !sessionStarted ? "hidden" : "auto",
              }}
            >
              {!sessionStarted && (
                <div className={styles.entryChat}>
                  <p className={styles.entryText}>OOO님 입장해주세요.</p>
                  <button
                    className={styles.enterButton}
                    onClick={handleStartInterview}
                  >
                    입장하기 ▶
                  </button>
                </div>
              )}

              {sessionStarted &&
                messages
                  .filter((it) => it.role !== "system")
                  .map((it, idx) => (
                    <ChatBox key={idx} text={it.content} role={it.role} />
                  ))}

              {isLoading && (
                <div className={styles.loading}>
                  <div className={styles[`loading-text`]}>
                    면접관이 답변을 준비하고 있습니다
                  </div>
                  <img
                    width="30px"
                    src={`${process.env.PUBLIC_URL}/assets/Spinner2.gif`}
                  />
                </div>
              )}
            </div>

            {sessionStarted && (
              <InputAns
                ans={ans}
                onClick={handleSubmit}
                setAns={setAns}
                isLoading={isLoading}
                isError={isError}
              />
            )}
          </div>
        </div>
      </div>

      {/* ✅ 오디오 컨트롤 추가 */}
      {audioUrl && (
        <audio
          src={audioUrl}
          controls
          autoPlay
          muted={false}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            zIndex: 9999,
            background: "white",
            border: "2px solid red",
          }}
        />
      )}
    </animated.div>
  );
};

export default Interview;
