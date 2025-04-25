import React, { FC, useState } from 'react';
 import styles from './AiJasoseoNavbar.module.scss';
 import { useNavigate } from 'react-router-dom';
 import {
  FaPenNib,
  FaCommentDots,
  FaBars,
  FaTimes,
 } from 'react-icons/fa';
 import { IoHomeSharp } from "react-icons/io5"; 
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
 

  const goToAiFeedback = () => {  // New function to navigate to AiFeedback
  navigate('/ai-feedback');
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
  <FaPenNib />
  <span>AI 자소서 작성</span>
  </li>
  <li onClick={goToAiFeedback}>  {/* Updated onClick handler */}
  <FaCommentDots />
  <span>AI 자소서 피드백</span>
  </li>
  </ul>
  <p className={styles.modeTitle}>EXTRA</p>
  <ul>
  <li onClick={() => navigate('/')}>
  <IoHomeSharp />
  <span>처음 화면</span>
  </li>
  </ul>
  </div>
  )}
  </>
  ) : (
  <>
  <div className={styles.title} onClick={handleGoBack}>
  <h2>AI 자소서 서비스</h2>
  </div>

  <div className={styles.modeWrapper}>
  <p className={styles.modeTitle}>MODE</p>
  <ul>
  <li className={styles.selected}>
  <FaPenNib />
  <span>AI 자소서 작성</span>
  </li>
  <li onClick={goToAiFeedback}>  {/* Updated onClick handler */}
  <FaCommentDots />
  <span>AI 자소서 피드백</span>
  </li>
  </ul>
  </div>
 

  <div className={styles.extraWrapper}>
  <p className={styles.modeTitle}>EXTRA</p>
  <ul>
  <li onClick={() => navigate('/')}>
  <IoHomeSharp />
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