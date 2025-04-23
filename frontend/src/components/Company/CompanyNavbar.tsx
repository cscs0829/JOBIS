// src/components/Company/CompanyNavbar.tsx
import React, { FC, useState, useEffect } from "react";
import styles from "./CompanyNavbar.module.scss"; //
import { useNavigate } from 'react-router-dom';
import {
    FaRegBuilding,
    FaUserTie,
    FaArrowLeft,
    FaBars,
    FaTimes,
} from 'react-icons/fa';
import { IoHomeSharp } from "react-icons/io5";
import { useMediaQuery } from 'react-responsive';
// import { mobileQuery } from '../../constants/constants';

// mobileQuery가 정의되지 않았을 경우를 대비한 기본값 설정
const mobileQuery = '(max-width: 768px)';

// CompanyNavbar 컴포넌트가 받을 prop 타입 정의
export interface CompanyNavbarProps {
    selectedTab: number;
    handleTabChange: (tabIndex: number) => void;
}

const CompanyNavbar: FC<CompanyNavbarProps> = ({ selectedTab, handleTabChange }) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: mobileQuery });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleGoBack = () => {
        navigate(-1);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // 탭 변경 및 메뉴 닫기 함수
    const handleTabClick = (tabIndex: number) => {
        handleTabChange(tabIndex);
        if (isMobile) {
            closeMobileMenu();
        }
    };

    // 페이지 이동 및 메뉴 닫기 함수
    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile) {
            closeMobileMenu();
        }
    };

    useEffect(() => {
        if (!isMobile) {
            setIsMobileMenuOpen(false);
        }
    }, [isMobile]);

    const getNavbarClass = () => {
      if (!isMobile) return styles.navbar;
      return `${styles.navbar} ${isMobileMenuOpen ? styles.appear : styles.disappear}`;
    };

    return (
        <>
          {isMobile && !isMobileMenuOpen && (
            <FaBars className={styles.menuIcon} onClick={toggleMobileMenu} />
          )}

          <nav className={getNavbarClass()}>
                {isMobile ? (
                    <>
                      <FaTimes className={styles.closeButton} onClick={closeMobileMenu} />
                      <div className={styles.title}>
                         <h2>회사 및 멘토 추천</h2>
                      </div>
                      <div className={styles.modeWrapper}>
                          <p className={styles.modeTitle}>MODE</p>
                          <ul>
                              <li
                                  className={selectedTab === 0 ? styles.selected : ""}
                                  onClick={() => handleTabClick(0)}
                              >
                                  <FaRegBuilding />
                                  <span>회사 추천</span>
                              </li>
                              {/* --- 수정된 부분 --- */}
                              <li
                                  className={selectedTab === 1 ? styles.selected : ""}
                                  // onClick={() => handleTabClick(1)} // 기존 코드
                                  onClick={() => handleNavigate('/mentor-recommendation')} // 페이지 이동 함수 호출
                              >
                                  <FaUserTie />
                                  <span>멘토 추천</span>
                              </li>
                              {/* --- 수정 완료 --- */}
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
                 <>
                     <div className={styles.title}>
                         <h2>회사 및 멘토 추천</h2>
                     </div>
                     <div className={styles.modeWrapper}>
                         <p className={styles.modeTitle}>MODE</p>
                         <ul>
                             <li
                                 className={selectedTab === 0 ? styles.selected : ""}
                                 onClick={() => handleTabClick(0)}
                             >
                                 <FaRegBuilding />
                                 <span>회사 추천</span>
                             </li>
                              {/* --- 수정된 부분 --- */}
                             <li
                                 className={selectedTab === 1 ? styles.selected : ""}
                                 // onClick={() => handleTabClick(1)} // 기존 코드
                                 onClick={() => handleNavigate('/mentor-recommendation')} // 페이지 이동 함수 호출
                             >
                                 <FaUserTie />
                                 <span>멘토 추천</span>
                             </li>
                             {/* --- 수정 완료 --- */}
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

export default CompanyNavbar;