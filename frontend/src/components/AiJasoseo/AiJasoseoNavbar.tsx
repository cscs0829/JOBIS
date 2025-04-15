import React, { FC, useState } from 'react';
 import styles from './AiJasoseoNavbar.module.scss';
 import { useNavigate } from 'react-router-dom';
 import {
  FaRegFileAlt,
  FaQuestionCircle,
  FaBars,
  FaArrowLeft,
  FaTimes,
 } from 'react-icons/fa';
 import { useMediaQuery } from 'react-responsive';
 import { mobileQuery } from '../../constants/constants';
 

 const AiJasoseoNavbar: FC = () => {
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
 

  const goToAiGuide = () => {  // New function to navigate to AiGuide
  navigate('/ai-guide');
  };
 

  return (
  <nav className={styles.navbar}>
  {isMobile ? (
  <>
  <FaBars className={styles.menuIcon} onClick={toggleMobileMenu} />
  <h2 className={styles.title}>AI 자소서 서비스</h2>
  {isMobileMenuOpen && (
  <div className={styles.mobileMenu}>
  <button className={styles.closeButton} onClick={closeMobileMenu}>
  <FaTimes />
  </button>
  <p className={styles.modeTitle}>MODE</p>
  <ul>
  <li className={styles.selected}>
  <FaRegFileAlt />
  <span>자소서 초안 작성</span>
  </li>
  <li onClick={goToAiGuide}>  {/* Updated onClick handler */}
  <FaQuestionCircle />
  <span>자소서 가이드</span>
  </li>
  </ul>
  <p className={styles.modeTitle}>EXTRA</p>
  <ul>
  <li onClick={() => navigate('/')}>
  <FaArrowLeft />
  <span>처음 화면</span>
  </li>
  </ul>
  </div>
  )}
  </>
  ) : (
  <>
  <div className={styles.title} onClick={handleGoBack}>
  <FaArrowLeft />
  <h2>AI 자소서 서비스</h2>
  </div>
 

  <div className={styles.modeWrapper}>
  <p className={styles.modeTitle}>MODE</p>
  <ul>
  <li className={styles.selected}>
  <FaRegFileAlt />
  <span>자소서 초안 작성</span>
  </li>
  <li onClick={goToAiGuide}>  {/* Updated onClick handler */}
  <FaQuestionCircle />
  <span>자소서 가이드</span>
  </li>
  </ul>
  </div>
 

  <div className={styles.extraWrapper}>
  <p className={styles.modeTitle}>EXTRA</p>
  <ul>
  <li onClick={() => navigate('/')}>
  <FaArrowLeft />
  <span>처음 화면</span>
  </li>
  </ul>
  </div>
  </>
  )}
  </nav>
  );
 };
 

 export default AiJasoseoNavbar;