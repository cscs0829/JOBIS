import styles from "./HomeLeftContainer.module.scss";
import { FC, useEffect, useRef } from "react";
import { Modes, mobileQuery } from "../../constants/constants";
import ModeBox from "./ModeBox";
import { HomeLeftContainerProps } from "../../types/types";
import { useMediaQuery } from "react-responsive";
import LoginButton from "./LoginButton";
import UserInfo from "../UserInfo"; // UserInfo 컴포넌트 import
import { useAuth } from "../../contexts/AuthContext"; // useAuth 훅 import

const HomeLeftContainer: FC<HomeLeftContainerProps> = ({
  selectedMode,
  setSelectedMode,
  rightContainerWidth,
  state,
}) => {
  const firstMountFlag = useRef(false);
  const isMobile = useMediaQuery({
    query: mobileQuery,
  });
  const { isLoggedIn } = useAuth(); // useAuth 훅에서 isLoggedIn 상태 가져오기

  useEffect(() => {
    firstMountFlag.current = true;
  }, []);

  const moveLeftAnimation = {
    transform:
      state === "exited"
        ? `translateX(${(rightContainerWidth as number) / 2}px)`
        : "none",
    opacity: firstMountFlag.current ? "100%" : "0%",
    transition: "all 500ms ease-in-out",
  };

  return (
    <div
      className={`${styles.HomeLeftContainer}`}
      style={isMobile ? {} : moveLeftAnimation}
    >
      {isLoggedIn ? (
        <UserInfo /> // 로그인 상태면 UserInfo 컴포넌트 렌더링
      ) : (
        <div className={styles.authContainer}>
          <LoginButton />
        </div>
      )}

      <section className={styles.title_section}>
        <h3>합격의 지름길</h3>
        <h2>위듀</h2>
        <p>
          你可以找到工作
          <br />
          면접에 합격하는 그날까지 {isMobile && <br />}위듀는 당신 곁에 있습니다
        </p>
      </section>

      <section className={styles.select_mode_section}>
        {Modes.map((it) => (
          <ModeBox
            key={it.key}
            id={it.key}
            title={it.title}
            description={it.description}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
          />
        ))}
      </section>
    </div>
  );
};

export default HomeLeftContainer;