import React from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./UserInfo.module.scss";
import { useNavigate } from "react-router-dom";

// Define the props interface
interface UserInfoProps {
  displayMode: "greeting" | "buttons"; // 'displayMode' can only be "greeting" or "buttons"
}

const UserInfo = ({ displayMode }: UserInfoProps) => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  if (!userInfo) {
    return null;
  }

  const handleMyInfoClick = () => {
    navigate("/user-info-edit");
  };

  const handleResumeEditClick = () => {
    navigate("/user-file-edit"); // 이력서 수정 페이지를 /user-file-edit 로 변경
  };

  if (displayMode === "greeting") {
    return (
      <div className={styles.userInfoText}>
        <p>안녕하세요, {userInfo.nickname}님!</p>
      </div>
    );
  }

  if (displayMode === "buttons") {
    return (
      <div className={styles.userInfoButtons}>
        <button className={styles.myInfoButton} onClick={handleMyInfoClick}>
          회원 수정
        </button>
        <button className={styles.resumeEditButton} onClick={handleResumeEditClick}>
          이력서 수정  {/* 이력서 수정 버튼 추가 */}
        </button>
        <button className={styles.logoutButton} onClick={logout}>로그아웃</button>
      </div>
    );
  }

  return null; // 기본적으로 아무것도 렌더링하지 않음
};

export default UserInfo;