import React, { FC, useState } from "react";
import styles from "./Navbar.module.scss";
import { NavbarProps } from "../../types/types";
import { FaUserEdit, FaFileAlt, FaStopCircle } from "react-icons/fa"; // FaStopCircle 아이콘 추가
import { VscDebugRestart } from "react-icons/vsc";
import { IoHomeSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const mobileQuery = "(max-width: 768px)";

const Navbar: FC<NavbarProps> = ({
  handleChangeMode,
  navbarToggle,
  setNavbarToggle,
  onEndInterview, // <-- props 추가
}) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: mobileQuery });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleModeItemClick = (modeId: string) => {
    console.log(`Selected mode: ${modeId}`);
    setSelectedItem(modeId);
    if (isMobile) {
       setNavbarToggle(false);
    }
  };

  // EXTRA 아이템 클릭 핸들러 수정
  const handleExtraItemClick = (action: 'restart' | 'home' | 'end') => { // 'end' 추가
    if (action === 'restart') {
      handleChangeMode(0);
      setSelectedItem('restart');
    } else if (action === 'home') {
      navigate('/');
      setSelectedItem('home');
    } else if (action === 'end') { // 'end' 액션 처리 추가
      onEndInterview(); // 부모 컴포넌트의 함수 호출
      setSelectedItem('end');
    }
     if (isMobile) {
        setNavbarToggle(false);
     }
  };


  const getNavbarClassName = () => {
    let baseClass = styles.Navbar;
    if (isMobile) {
      return `${baseClass} ${navbarToggle ? styles.appear : ''}`;
    }
    return baseClass;
  };

  return (
    <div className={getNavbarClassName()}>
      {isMobile && (
        <FaXmark
          className={styles.cancel}
          onClick={() => setNavbarToggle(false)}
        />
      )}

      <div className={styles.title}>
        <h2>AI 면접</h2>
      </div>

      {/* EXTRA Section 수정 */}
      <div className={styles.extra_wrapper}>
        <div className={styles.section_title}>EXTRA</div>
        <ul>
          <li
            className={selectedItem === 'restart' ? styles.selected : ''}
            onClick={() => handleExtraItemClick('restart')}
          >
            <VscDebugRestart />
            <span>면접 재시작</span>
          </li>
          {/* 면접 종료 버튼 추가 */}
          <li
            className={selectedItem === 'end' ? styles.selected : ''}
            onClick={() => handleExtraItemClick('end')} // 'end' 액션으로 변경
          >
            <FaStopCircle /> {/* 아이콘 변경 */}
            <span>면접 종료</span>
          </li>
          <li
             className={selectedItem === 'home' ? styles.selected : ''}
             onClick={() => handleExtraItemClick('home')}
          >
            <IoHomeSharp />
            <span>처음 화면</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;