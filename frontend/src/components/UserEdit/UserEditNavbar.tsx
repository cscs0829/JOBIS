// 1. React 관련 import
import React, { FC, useState } from 'react';

// 2. 외부 라이브러리 import
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { GiHamburgerMenu } from "react-icons/gi";
// --- 아이콘 추가 ---
import {
  FaUser,
  FaFile,
  FaPenNib, // AI 자소서
  FaCommentDots, // AI 피드백
  FaBuilding, // 기업 추천
  FaUserGraduate // 멘토 추천
} from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
// -----------------

// 3. 로컬 import (스타일, 상수 등)
import styles from './UserEditNavbar.module.scss';
// import { mobileQuery } from "../../constants/constants"; // 실제 경로 사용 권장
const mobileQuery = "(max-width: 768px)"; // 임시 정의 또는 위 import 주석 해제

// --- 컴포넌트 코드 시작 ---
const UserEditNavbar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navbarToggle, setNavbarToggle] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: mobileQuery });

  // --- getActiveMode 함수 수정 ---
  const getActiveMode = () => {
    const pathname = location.pathname;
    if (pathname.includes('/user-info-edit')) return 'info';
    if (pathname.includes('/user-file-edit')) return 'file';
    if (pathname.includes('/ai-jasoseo')) return 'jasoseo'; // 추가
    if (pathname.includes('/ai-feedback')) return 'feedback'; // 추가
    if (pathname.includes('/company-recommendation')) return 'company'; // 추가
    if (pathname.includes('/mentor-recommendation')) return 'mentor'; // 추가
    if (pathname === '/') return 'home';
    return null;
  };
  // --------------------------

  const activeMode = getActiveMode();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setNavbarToggle(false);
    }
  };

  return (
    <div className={`${styles.navbar} ${isMobile ? (navbarToggle ? styles.appear : styles.disappear) : ''}`}>
      {isMobile && (
        <GiHamburgerMenu className={styles.hamburgerIcon} onClick={() => setNavbarToggle(!navbarToggle)} />
      )}
      <div className={styles.title}>
        <h2>회원 수정</h2>
      </div>

      <div className={styles.modeWrapper}>
        <div className={styles.modeTitle}>MODE</div>
        <ul>
          {/* --- 기존 메뉴 항목 --- */}
          <li
            className={activeMode === 'info' ? styles.selected : ''}
            onClick={() => handleNavigate('/user-info-edit')}
          >
            <FaUser />
            <span>회원 정보 수정</span>
          </li>
          <li
            className={activeMode === 'file' ? styles.selected : ''}
            onClick={() => handleNavigate('/user-file-edit')}
          >
            <FaFile />
            <span>회원 파일 수정</span>
          </li>
          {/* --- 새로운 메뉴 항목 추가 --- */}
          <li
            className={activeMode === 'jasoseo' ? styles.selected : ''}
            onClick={() => handleNavigate('/ai-jasoseo')}
          >
            <FaPenNib />
            <span>AI 자소서 작성</span>
          </li>
          <li
            className={activeMode === 'feedback' ? styles.selected : ''}
            onClick={() => handleNavigate('/ai-feedback')}
          >
            <FaCommentDots />
            <span>AI 자소서 피드백</span>
          </li>
          <li
            className={activeMode === 'company' ? styles.selected : ''}
            onClick={() => handleNavigate('/company-recommendation')}
          >
            <FaBuilding />
            <span>기업 추천</span>
          </li>
          <li
            className={activeMode === 'mentor' ? styles.selected : ''}
            onClick={() => handleNavigate('/mentor-recommendation')}
          >
            <FaUserGraduate />
            <span>멘토 추천</span>
          </li>
          {/* ------------------------ */}
        </ul>
      </div>

      <div className={styles.extraWrapper}>
        <div className={styles.extraTitle}>EXTRA</div>
        <ul>
          <li
            className={activeMode === 'home' ? styles.selected : ''}
            onClick={() => handleNavigate('/')}
          >
            <IoHomeSharp />
            <span>처음 화면</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserEditNavbar;