// src/components/Mentor/MentorNavbar.tsx
import React, { FC, useState, useEffect } from "react";
import styles from "./MentorNavbar.module.scss"; // SCSS 파일 임포트
import { useNavigate } from 'react-router-dom';
import {
    FaRegBuilding, // 아이콘 변경: FaRegFileAlt -> FaRegBuilding (회사)
    FaUserTie,    // 아이콘 변경: FaQuestionCircle -> FaUserTie (멘토)
    // FaArrowLeft, // 사용하지 않으므로 제거 가능
    FaBars,
    FaTimes,
} from 'react-icons/fa';
import { IoHomeSharp } from "react-icons/io5"; // IoHomeSharp 임포트
import { useMediaQuery } from 'react-responsive';
// import { mobileQuery } from '../../constants/constants'; // mobileQuery 경로는 실제 프로젝트에 맞게 확인하세요.

// mobileQuery가 정의되지 않았을 경우를 대비한 기본값 설정
const mobileQuery = '(max-width: 768px)';

// MentorNavbar 컴포넌트가 받을 prop 타입 정의
export interface MentorNavbarProps {
    selectedTab: number; // 현재 선택된 탭 (0: 회사, 1: 멘토)
    handleTabChange: (tabIndex: number) => void; // 탭 변경 핸들러
}

const MentorNavbar: FC<MentorNavbarProps> = ({ selectedTab, handleTabChange }) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: mobileQuery });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 뒤로 가기 (사용하지 않을 경우 제거 가능)
    // const handleGoBack = () => {
    //     navigate(-1);
    // };

    // 모바일 메뉴 토글
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // 모바일 메뉴 닫기
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // 탭 변경 및 메뉴 닫기 함수 (멘토 추천 클릭 시 사용)
    const handleTabClick = (tabIndex: number) => {
        handleTabChange(tabIndex); // 상위 컴포넌트에 탭 변경 알림
        if (isMobile) {
            closeMobileMenu(); // 모바일에서 메뉴 닫기
        }
    };

    // 페이지 이동 및 메뉴 닫기 함수 (회사 추천, 처음 화면 클릭 시 사용)
    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile) {
            closeMobileMenu(); // 모바일에서 메뉴 닫기
        }
    };

    // 화면 크기 변경 시 모바일 메뉴 닫기
    useEffect(() => {
        if (!isMobile) {
            setIsMobileMenuOpen(false);
        }
    }, [isMobile]);

    // Navbar 클래스 결정 로직
    const getNavbarClass = () => {
      if (!isMobile) return styles.navbar;
      return `${styles.navbar} ${isMobileMenuOpen ? styles.appear : styles.disappear}`;
    };

    return (
        <>
          {/* 모바일 메뉴 아이콘 (isMobile 이고 메뉴가 닫혀있을 때만 렌더링) */}
          {isMobile && !isMobileMenuOpen && (
            <FaBars className={styles.menuIcon} onClick={toggleMobileMenu} />
          )}

          {/* Navbar 본문 */}
          <nav className={getNavbarClass()}>
                {/* === 모바일 뷰 === */}
                {isMobile ? (
                    <>
                      {/* 닫기 버튼 (isMobile 이고 메뉴가 열려있을 때) */}
                      <FaTimes className={styles.closeButton} onClick={closeMobileMenu} />

                      {/* 모바일 타이틀 */}
                      <div className={styles.title}>
                         <h2>회사 및 멘토 추천</h2>
                      </div>

                      {/* 모바일 메뉴 내용 */}
                      <div className={styles.modeWrapper}>
                          <p className={styles.modeTitle}>MODE</p>
                          <ul>
                              {/* 회사 추천 */}
                              <li
                                  className={selectedTab === 0 ? styles.selected : ""}
                                  onClick={() => handleNavigate('/company-recommendation')} // 페이지 이동
                              >
                                  <FaRegBuilding />
                                  <span>회사 추천</span>
                              </li>
                              {/* 멘토 추천 */}
                              <li
                                  className={selectedTab === 1 ? styles.selected : ""}
                                  onClick={() => handleTabClick(1)} // 탭 변경 (페이지 이동 없음)
                              >
                                  <FaUserTie />
                                  <span>멘토 추천</span>
                              </li>
                          </ul>
                      </div>
                      <div className={styles.extraWrapper}>
                           <p className={styles.modeTitle}>EXTRA</p>
                           <ul>
                               <li onClick={() => handleNavigate('/')}>
                                   <IoHomeSharp />
                                   <span>처음 화면</span>
                               </li>
                           </ul>
                      </div>
                    </>
                ) : (
                 /* === 데스크탑 뷰 === */
                 <>
                     {/* 데스크탑 타이틀 */}
                     <div className={styles.title}>
                         <h2>회사 및 멘토 추천</h2>
                     </div>

                     {/* 데스크탑 메뉴 내용 */}
                     <div className={styles.modeWrapper}>
                         <p className={styles.modeTitle}>MODE</p>
                         <ul>
                             {/* 회사 추천 */}
                             <li
                                 className={selectedTab === 0 ? styles.selected : ""}
                                 onClick={() => handleNavigate('/company-recommendation')} // 페이지 이동
                             >
                                 <FaRegBuilding />
                                 <span>회사 추천</span>
                             </li>
                             {/* 멘토 추천 */}
                             <li
                                 className={selectedTab === 1 ? styles.selected : ""}
                                 onClick={() => handleTabClick(1)} // 탭 변경 (페이지 이동 없음)
                             >
                                 <FaUserTie />
                                 <span>멘토 추천</span>
                             </li>
                         </ul>
                     </div>

                     <div className={styles.extraWrapper}>
                         <p className={styles.modeTitle}>EXTRA</p>
                         <ul>
                             <li onClick={() => handleNavigate('/')}>
                                 <IoHomeSharp />
                                 <span>처음 화면</span>
                             </li>
                         </ul>
                     </div>
                 </>
                )}
          </nav>
        </>
    );
};

export default MentorNavbar;