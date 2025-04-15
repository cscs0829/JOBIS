import React, { FC, useState } from 'react';
import styles from './UserEditNavbar.module.scss';
import { UserEditNavbarProps } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { mobileQuery } from "../../constants/constants";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser, FaFile } from "react-icons/fa"; // 아이콘 추가
import { IoHomeSharp } from "react-icons/io5";

const UserEditNavbar: FC<UserEditNavbarProps> = ({
    selectedTab, handleTabChange }) => {
    const navigate = useNavigate();
    const [navbarToggle, setNavbarToggle] = useState<boolean>(false);
    const isMobile = useMediaQuery({ query: mobileQuery });

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
                        className={`${styles.modeItem} ${selectedTab === 0 ? styles.selected : ''}`}
                        onClick={() => handleTabChange(0)}
                    >
                        <FaUser /> {/* 아이콘 추가 */}
                        <span>회원 정보 수정</span>
                    </li>
                    <li
                        className={`${styles.modeItem} ${selectedTab === 1 ? styles.selected : ''}`}
                        onClick={() => handleTabChange(1)}
                    >
                        <FaFile /> {/* 아이콘 추가 */}
                        <span>회원 파일 수정</span>
                    </li>
                </ul>
            </div>

            <div className={styles.extraWrapper}>
                <div className={styles.extraTitle}>EXTRA</div>
                <ul>
                    <li onClick={() => navigate('/')} className={styles.extraItem}>
                        <IoHomeSharp /> {/* 아이콘 추가 */}
                        <span>처음 화면</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserEditNavbar;