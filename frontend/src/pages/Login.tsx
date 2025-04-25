import styles from "./Login.module.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(id, password);
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>
      {/* --- 하단 링크 문구 및 구조 수정 --- */}
      <div className={styles.bottomLinks}>
        {/* "계정이 없으신가요? 회원가입" 문구와 /signup 링크 */}
        <p className={styles.linkPrimary} onClick={() => navigate("/signup")}>
          계정이 없으신가요? 회원가입
        </p>
        {/* "메인으로" 문구와 / 링크 */}
        <p className={styles.linkSecondary} onClick={() => navigate("/")}>
          메인으로
        </p>
      </div>
      {/* -------------------------------- */}
    </div>
  );
};

export default Login;