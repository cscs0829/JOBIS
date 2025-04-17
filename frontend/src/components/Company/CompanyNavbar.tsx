import React, { FC, useState } from "react";
import styles from "./CompanyNavbar.module.scss";
import { CompanyMentorNavbarProps } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { IoBusinessOutline, IoPersonCircleOutline, IoHomeSharp } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import { mobileQuery } from "../../constants/constants";

const CompanyNavbar: FC<CompanyMentorNavbarProps> = ({
  selectedTab,
  handleTabChange,
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ query: mobileQuery });

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const goToCompanyRecommendation = () => {
    navigate("/company-recommendation");
  };

  const goToMentorRecommendation = () => {
    navigate("/mentor-recommendation");
  };

  return (
    <nav className={`${styles.Navbar} ${isMobileMenuOpen ? styles.open : ""}`}>
      {isMobile && (
        <FaTimes className={styles.mobile_menu_icon} onClick={closeMobileMenu} />
      )}

      <div className={styles.title}>
        <h2>회사 및 멘토 추천</h2>
      </div>

      <div className={styles.mode_wrapper}>
        <div className={styles.mode_title}>Mode</div>
        <ul>
          <li
            className={`${styles.mode_item} ${selectedTab === 0 ? styles.selected : ""}`}
            onClick={() => { goToCompanyRecommendation(); if (isMobile) closeMobileMenu(); }}
          >
            <IoBusinessOutline />
            <span>회사 추천</span>
          </li>
          <li
            className={`${styles.mode_item} ${selectedTab === 1 ? styles.selected : ""}`}
            onClick={() => { goToMentorRecommendation(); if (isMobile) closeMobileMenu(); }}
          >
            <IoPersonCircleOutline />
            <span>멘토 추천</span>
          </li>
        </ul>
      </div>

      <div className={styles.extra_wrapper}>
        <div className={styles.extra_title}>Extra</div>
        <ul>
          <li onClick={() => navigate("/")}>
            <IoHomeSharp />
            <span>처음화면</span>
          </li>
        </ul>
      </div>
      {isMobile && !isMobileMenuOpen && (
        <FaTimes className={styles.mobile_menu_icon} onClick={() => setIsMobileMenuOpen(true)} />
      )}
    </nav>
  );
};

export default CompanyNavbar;