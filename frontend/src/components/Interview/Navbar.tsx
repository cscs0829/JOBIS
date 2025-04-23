import React, { FC, useState } from "react"; // useState 추가 (선택 상태 관리용 예시)
import styles from "./Navbar.module.scss";
import { NavbarProps } from "../../types/types"; // NavbarProps 정의 확인 필요
import { FaUserEdit, FaFileAlt } from "react-icons/fa"; // MODE 아이콘 예시
import { VscDebugRestart } from "react-icons/vsc";
import { IoHomeSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
// import { mobileQuery } from "../../constants/constants"; // 경로 확인 필요
const mobileQuery = "(max-width: 768px)"; // 임시 정의

// NavbarProps 인터페이스 예시 (필요에 따라 수정)
// interface NavbarProps {
//   handleChangeMode: (modeNum: number) => void; // '면접 재시작' 핸들러
//   navbarToggle: boolean;
//   setNavbarToggle: React.Dispatch<React.SetStateAction<boolean>>;
//   // mode 선택 관련 prop 추가 가능
//   // onSelectMode?: (modeId: string) => void;
// }

const Navbar: FC<NavbarProps> = ({
  handleChangeMode,
  navbarToggle,
  setNavbarToggle,
  // onSelectMode,
}) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: mobileQuery });

  // 선택된 메뉴 아이템 상태 관리 (예시)
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // MODE 아이템 클릭 핸들러 (예시)
  const handleModeItemClick = (modeId: string) => {
    console.log(`Selected mode: ${modeId}`);
    setSelectedItem(modeId); // 선택 상태 업데이트
    // if (onSelectMode) {
    //   onSelectMode(modeId); // 부모 컴포넌트로 이벤트 전달
    // }
    // 페이지 이동 또는 다른 로직 수행
    // 예: if (modeId === 'info_edit') navigate('/user-edit/info');
    if (isMobile) {
       setNavbarToggle(false); // 모바일에서 항목 선택 시 메뉴 닫기
    }
  };

  // EXTRA 아이템 클릭 핸들러 (기존 로직 통합)
  const handleExtraItemClick = (action: 'restart' | 'home') => {
    if (action === 'restart') {
      handleChangeMode(0); // 면접 재시작
      setSelectedItem('restart');
    } else if (action === 'home') {
      navigate('/'); // 처음 화면으로 이동
      setSelectedItem('home');
    }
     if (isMobile) {
       setNavbarToggle(false); // 모바일에서 항목 선택 시 메뉴 닫기
    }
  };


  // Navbar 클래스 결정 로직 (모바일만 appear/disappear 적용)
  const getNavbarClassName = () => {
    let baseClass = styles.Navbar;
    if (isMobile) {
      return `${baseClass} ${navbarToggle ? styles.appear : ''}`;
    }
    return baseClass; // 데스크탑에서는 항상 기본 클래스
  };

  return (
    // 모바일 오버레이 (필요 시)
    // <div className={`${styles.navbarOverlay} ${isMobile && navbarToggle ? styles.active : ''}`} onClick={() => setNavbarToggle(false)}></div>

    <div className={getNavbarClassName()}>
      {isMobile && (
        <FaXmark
          className={styles.cancel}
          onClick={() => setNavbarToggle(false)}
        />
      )}

      <div className={styles.title}>
        <h2>AI 면접</h2> {/* 기존 제목 유지 */}
      </div>

      

       {/* EXTRA Section */}
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