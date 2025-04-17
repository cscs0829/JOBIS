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

  const abortController = useRef<AbortController | null>(null);
  const isMount = useRef<boolean>(true);
  const navigate = useNavigate();
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);

  const isMobile = useMediaQuery({
    query: mobileQuery,
  });

  useEffect(() => {
    if (chatListRef.current !== null)
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [messages]);

  const [springs, api] = useSpring(() => interviewAnimation);

  useEffect(() => {
    isMount.current = true;
    handleSubmit();
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

  const handleSubmit = async () => {
    if (!isMount.current && (isLoading || isError)) return;
    setIsLoading(true);
    isMount.current = false;

    setAns("");

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
      ...(ans ? [{ role: "user", content: ans }] : []),
    ];

    setMessages(updatedMessages);
    abortController.current = new AbortController();

    try {
      const response = await fetch("http://localhost:9000/interview/interview", {
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
      });

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
