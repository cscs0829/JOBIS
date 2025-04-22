import styles from "./Signup.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    mem_id: "",
    mem_pw: "",
    mem_email: "",
    mem_nick: "",
    mem_gender: "",
    mem_birthdate: "",
    mem_addr: "",
    mem_phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({
        mem_id: formData.mem_id,
        mem_pw: formData.mem_pw,
        mem_email: formData.mem_email,
        mem_nick: formData.mem_nick,
        mem_gender: formData.mem_gender,
        mem_birthdate: formData.mem_birthdate,
        mem_addr: formData.mem_addr,
        mem_phone: formData.mem_phone,
      });
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input name="mem_id" type="text" placeholder="아이디" onChange={handleChange} />
        <input name="mem_pw" type="password" placeholder="비밀번호" onChange={handleChange} />
        <input name="mem_email" type="email" placeholder="이메일" onChange={handleChange} />
        <input name="mem_nick" type="text" placeholder="닉네임" onChange={handleChange} />
        <div className={styles.genderButtons}>
          <label>
            <input type="radio" name="mem_gender" value="M" onChange={handleChange} />
            남자
          </label>
          <label>
            <input type="radio" name="mem_gender" value="F" onChange={handleChange} />
            여자
          </label>
        </div>
        <input name="mem_birthdate" type="date" placeholder="생년월일" onChange={handleChange} />
        <input name="mem_addr" type="text" placeholder="주소" onChange={handleChange} />
        <input name="mem_phone" type="tel" placeholder="연락처" onChange={handleChange} />

        <button type="submit">회원가입</button>
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '20px' }}>
        <p style={{ cursor: 'pointer' }} onClick={() => navigate("/login")}>
          로그인
        </p>
        <p style={{ cursor: 'pointer' }} onClick={() => navigate("/")}>
          메인
        </p>
      </div>
    </div>
  );
};

export default Signup;