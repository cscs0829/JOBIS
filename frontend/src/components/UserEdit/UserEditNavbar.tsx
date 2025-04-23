// 1. React 관련 import
import React, { FC, useState } from 'react';

// 2. 외부 라이브러리 import
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser, FaFile } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";

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

    const getActiveMode = () => {
        if (location.pathname.includes('/user-info-edit')) {
            return 'info';
        }
        if (location.pathname.includes('/user-file-edit')) {
            return 'file';
        }
        if (location.pathname === '/') {
             return 'home';
        }
        return null;
    };

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