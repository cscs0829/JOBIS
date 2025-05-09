// src/components/Home/LoginButton.tsx

import { useNavigate, Link } from "react-router-dom"; // Link 추가 (권장)
import "./LoginButton.scss"; // SCSS 파일 import

function LoginButton() {

  return (
    <div className="sign_button">
      <Link to="/login">로그인</Link>
      <Link to="/signup">회원가입</Link>

    </div>
  );
}

export default LoginButton;