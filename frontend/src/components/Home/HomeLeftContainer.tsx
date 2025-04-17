import styles from "./HomeLeftContainer.module.scss";
import { FC, useEffect, useRef } from "react";
import { Modes, mobileQuery } from "../../constants/constants";
import ModeBox from "./ModeBox";
import { HomeLeftContainerProps } from "../../types/types";
import { useMediaQuery } from "react-responsive";
import LoginButton from "./LoginButton";
import UserInfo from "../UserInfo";
import { useAuth } from "../../contexts/AuthContext";

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
  const { isLoggedIn } = useAuth();

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
        <div className={styles.userInfoContainer}>
          <div className={styles.userInfoGreeting}>
            <UserInfo displayMode="greeting" />  {/* UserInfo 컴포넌트 재사용 */}
          </div>
          <div className={styles.userInfoButtons}>
            <UserInfo displayMode="buttons" />  {/* UserInfo 컴포넌트 재사용 */}
          </div>
        </div>
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