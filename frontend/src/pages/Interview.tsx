import { useState, useRef, useEffect, useContext } from "react";
import ChatBox from "../components/Interview/ChatBox";
import InputAns from "../components/Interview/InputAns";
import styles from "./Interview.module.scss";
import { FC } from "react";
import { nameJobContext } from "../App";
import { NameJobContext } from "../types/types";

import { useNavigate, useParams } from "react-router-dom";
import { Modes, mobileQuery } from "../constants/constants";
import { useSpring, animated } from "@react-spring/web";
import { useMediaQuery } from "react-responsive";
import { GiHamburgerMenu } from "react-icons/gi";
import Navbar from "../components/Interview/Navbar";

// Interview 컴포넌트 등장 애니메이션
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
  // useParams()에서 기본값 설정
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

  const abortController = useRef<AbortController | null>(null);
  const isMount = useRef<boolean>(true);
  const navigate = useNavigate();
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);

  const isMobile = useMediaQuery({
    query: mobileQuery,
  });

  const saveMessageToDB = async (
    intr_idx: number,
    talk_person: "interviewer" | "interviewee",
    talk_content: string
  ) => {
    console.log("📤 DB 저장 요청!", { intr_idx, talk_person, talk_content });
    try {
      await fetch("http://localhost:9000/interview/save-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intr_idx: intr_idx,
          talk_person: talk_person,
          talk_content: talk_content,
        }),
      });
    } catch (err) {
      console.error("❌ 메시지 저장 실패:", err);
    }
  };

  useEffect(() => {
    if (sessionId !== null && messages.length === 0) {
      console.log("🎯 세션 준비 완료 후 첫 질문 실행");
      handleSubmit("");
    }
  }, [sessionId]);

  useEffect(() => {
    const startInterviewSession = async () => {
      console.log("🔥 start 호출 직전");

      const storedMemId = localStorage.getItem("mem_id");

      console.log("🚀 전달값:", {
        persona: name,
        job,
        interviewType,
        mem_id: storedMemId, // ✅ 바로 반영
      });

      try {
        const res = await fetch("http://localhost:9000/interview/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            persona: name,
            job: job,
            interviewType: interviewType,
            mem_id: storedMemId,
          }),
        });
        console.log("🚀 전달값:", {
          persona: name,
          job,
          interviewType,
          mem_id: storedMemId,
        });
        const data = await res.json();
        setSessionId(data.session_id);
        console.log("✅세션 ID:", data.session_id);
      } catch (err) {
        console.error("❌ 요청 실패:", err);
      }
    };

    startInterviewSession();
  }, []);

  useEffect(() => {
    if (chatListRef.current !== null)
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [messages]);

  const [springs, api] = useSpring(() => interviewAnimation);

  useEffect(() => {
    isMount.current = true;
    api.start(interviewAnimation);
    setNavbarToggle(false);

    return () => {
      abortController.current?.abort();
    };
  }, [restartToggle.current]);

  const handleChangeMode = (modeNum: Number) => {
    restartToggle.current = !restartToggle.current;
    setMessages([]);
    setAns("");
    setIsError(false);
    navigate(`/interview`);
  };

  const handleSubmit = async (inputAns: string) => {
    if (!isMount.current && (isLoading || isError)) return;
    setIsLoading(true);
    isMount.current = false;

    const isFirst = messages.length === 0;

    const systemPrompt = {
      role: "system",
      content: `
      [역할]
      너는 ${name} 스타일의 AI 면접관 역할을 수행하고 있어.
      
      [상황]
      지원자는 ${job} 직무에 지원했어.
      ${interviewType} 유형의 면접을 진행할거야.
      
      [규칙]
      🎯 면접 시 유의사항:
      
      1. 처음 질문은 인사 없이 바로 시작하세요. "첫 질문", "시작하겠습니다", "지원해주셔서 감사합니다" 같은 말 절대 하지 마세요.
      2. 질문은 짧고 명확하게, 최대 2문장 이내로 하세요.
      3. 사용자의 마지막 답변을 기반으로 꼭! 꼬리 질문을 이어가세요.
      4. 질문은 총 5개 이내로 제한합니다.
      
      [행동]
      지금부터 첫 질문을 하세요.
      `.trim(),
    };

    const filteredMessages = messages.filter((msg) => {
      return !(msg.role === "assistant" && /첫.*질문/gi.test(msg.content));
    });

    const updatedMessages = [
      ...(isFirst ? [systemPrompt] : []),
      ...messages,
      ...(ans ? [{ role: "user", content: inputAns }] : []),
    ];

    // ✅ 사용자 답변 저장 (ans 값이 있을 경우에만)
    if (ans && sessionId) {
      await saveMessageToDB(sessionId, "interviewee", ans);
    }

    setMessages(updatedMessages);
    setAns("");
    abortController.current = new AbortController();

    try {
      const response = await fetch(
        "http://localhost:9000/interview/interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            persona: name,
            job: job,
            interviewType: interviewType,
            selectedMode: selectedMode,
            messages: updatedMessages,
          }),
          signal: abortController.current?.signal,
        }
      );

      const data = await response.json();

      if (response.status === 400) {
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content:
              "면접이 너무 길어져 더 이상 진행할 수 없습니다.\n면접을 다시 시작해 주시기 바랍니다.\n불편을 드려 죄송합니다.",
          },
        ]);
        setIsError(true);
      } else if (response.status === 200) {
        const assistantMessage = {
          role: "assistant",
          content: data.reply,
        };

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);

        if (sessionId !== null) {
          await saveMessageToDB(sessionId, "interviewer", data.reply);
        }

        setMessages([...updatedMessages, assistantMessage]);
      }
    } catch (err) {
      console.error("면접 중 오류 발생:", err);
      setIsError(true);
    }
    setIsLoading(false);
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
            <img
              src={`${process.env.PUBLIC_URL}/assets/logo.png`}
              width={isMobile ? "35px" : "50px"}
            />
          </div>

          <Navbar
            navbarToggle={navbarToggle}
            handleChangeMode={handleChangeMode}
            setNavbarToggle={setNavbarToggle}
          />
        </div>
        <div className={styles.interview_right}>
          <div className={styles.interview_right_wrapper}>
            <div className={styles.chatList} ref={chatListRef}>
              {messages
                .filter((it) => it.role !== "system")
                .map((it, idx) => (
                  <ChatBox key={idx} text={it.content} role={it.role} />
                ))}
              {isLoading ? (
                <div className={styles.loading}>
                  <div className={styles[`loading-text`]}>
                    면접관이 답변을 준비하고 있습니다
                  </div>
                  <img
                    width="30px"
                    src={`${process.env.PUBLIC_URL}/assets/Spinner2.gif`}
                  />
                </div>
              ) : null}
            </div>
            <InputAns
              ans={ans}
              onClick={handleSubmit}
              setAns={setAns}
              isLoading={isLoading}
              isError={isError}
            />
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Interview;
