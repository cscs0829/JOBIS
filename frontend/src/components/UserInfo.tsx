import React from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./UserInfo.module.scss";

const UserInfo = () => {
  const { userInfo, logout } = useAuth();

  if (!userInfo) {
    return null;
  }

  const handleMyInfoClick = () => {
    // "내 정보" 버튼 클릭 시 처리할 로직 (예: 페이지 이동)
    alert("내 정보 페이지로 이동합니다!"); // 예시: alert 메시지
  };

  return (
    <div className={styles.userInfoContainer}>
      <div className={styles.userInfoText}>
        <p>안녕하세요, {userInfo.nickname}님!</p>
        {userInfo.id && <p>아이디: {userInfo.id}</p>}
      </div>
      <div className={styles.userInfoButtons}>
        <button className={styles.myInfoButton} onClick={handleMyInfoClick}>
          내 정보
        </button>
        <button onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
};

export default UserInfo;