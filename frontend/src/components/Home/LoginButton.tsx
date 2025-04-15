// src/components/LoginButton.tsx

import { useNavigate } from "react-router-dom";
import "./LoginButton.scss";

function LoginButton() {
  const navigate = useNavigate();

  return (
    <div className="login-button">
      <button onClick={() => navigate("/login")}>로그인</button>
      <button onClick={() => navigate("/signup")}>회원가입</button>
    </div>
  );
}

export default LoginButton;
