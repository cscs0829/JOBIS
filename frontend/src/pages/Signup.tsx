// src/pages/Signup.tsx
import styles from "./Signup.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthday: "",
    gender: "",
    address: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    try {
      await signup({
        mem_id: formData.email,
        mem_pw: formData.password,
        mem_email: formData.email,
        mem_nick: formData.nickname,
        mem_gender: formData.gender === "male" ? "M" : "F",
        mem_birthdate: formData.birthday,
        mem_addr: formData.address,
        mem_phone: formData.phone,
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
        <input name="email" type="email" placeholder="이메일" onChange={handleChange} />
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} />
        <input name="confirmPassword" type="password" placeholder="비밀번호 확인" onChange={handleChange} />
        <input name="nickname" type="text" placeholder="닉네임" onChange={handleChange} />
        <input name="birthday" type="date" placeholder="생년월일" onChange={handleChange} />
        <div className={styles.genderButtons}>
          <label>
            <input type="radio" name="gender" value="male" onChange={handleChange} />
            남자
          </label>
          <label>
            <input type="radio" name="gender" value="female" onChange={handleChange} />
            여자
          </label>
        </div>
        <input name="address" type="text" placeholder="주소" onChange={handleChange} />
        <input name="phone" type="tel" placeholder="연락처" onChange={handleChange} />

        <button type="submit">회원가입</button>
        <p onClick={() => navigate("/login")}>로그인</p>
      </form>
    </div>
  );
};

export default Signup;
