import React, { FC, useState } from "react";
import styles from "./MentorNavbar.module.scss";
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

// MentorNavbar 컴포넌트가 받을 prop 타입 정의 (CompanyNavbarProps와 동일하다고 가정)
export interface MentorNavbarProps {
    selectedTab: number;
    handleTabChange: (tabIndex: number) => void;
}

const MentorNavbar: FC<MentorNavbarProps> = ({ selectedTab, handleTabChange }) => {
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

    const goToCompanyRecommendation = () => {
        navigate("/company-recommendation");
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
                        <li onClick={goToCompanyRecommendation}> 
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
                <h2 className={styles.title}>회사 및 멘토 추천</h2> 


                <div className={styles.modeWrapper}>
                    <p className={styles.modeTitle}>MODE</p>
                    <ul>
                        <li className={styles.selected }> 
                            <FaRegFileAlt />
                            <span>회사 추천</span>
                        </li>
                        <li onClick={goToCompanyRecommendation}> 
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

export default MentorNavbar;