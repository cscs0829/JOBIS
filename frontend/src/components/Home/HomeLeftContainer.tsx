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
  <h3>당신의 커리어 내비게이터</h3>
  <h2>J.O.B.I.S</h2>
  <p>
    원하는 미래를 향한 가장 확실한 선택, {isMobile && <br />} J.O.B.I.S가 길을 안내합니다.
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
      
      <img
        src="/mainimg.png" // public 폴더 기준 경로
        alt="J.O.B.I.S 메인 이미지"
        className={styles.mainImage} // 스타일링 클래스
      />

    </div>
  );
};

export default HomeLeftContainer;