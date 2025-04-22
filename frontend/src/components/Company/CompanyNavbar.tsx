// src/components/Company/CompanyNavbar.tsx
import React, { FC, useState } from "react";
import styles from "./CompanyNavbar.module.scss";
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

    const goToMentorRecommendation = () => {
        navigate("/mentor-recommendation");
    };

    return (
        <nav className={styles.navbar}>
            {isMobile ? (
            <>
                <FaBars className={styles.menuIcon} onClick={toggleMobileMenu} />
                <h2 className={styles.title}>회사 및 멘토 추천</h2>
                {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <button className={styles.closeButton} onClick={closeMobileMenu}>
                        <FaTimes />
                    </button>
                    <p className={styles.modeTitle}>MODE</p>
                    <ul>
                        <li className={styles.selected}>
                            <FaRegFileAlt />
                            <span>회사 추천</span>
                        </li>
                        <li onClick={goToMentorRecommendation}> {/* Updated onClick handler */}
                            <FaQuestionCircle />
                            <span>멘토 추천</span>
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
                <h2 className={styles.title}>회사 및 멘토 추천</h2> {/* Removed the arrow icon and onClick handler */}


                <div className={styles.modeWrapper}>
                    <p className={styles.modeTitle}>MODE</p>
                    <ul>
                        <li className={styles.selected}>
                            <FaRegFileAlt />
                            <span>회사 추천</span>
                        </li>
                        <li onClick={goToMentorRecommendation}> {/* Updated onClick handler */}
                            <FaQuestionCircle />
                            <span>멘토 추천</span>
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

export default CompanyNavbar;