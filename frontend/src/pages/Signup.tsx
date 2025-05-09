import styles from "./Signup.module.scss";
import React, { useState, useEffect } from "react"; // React 임포트 추가
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    mem_id: "", mem_pw: "", confirmPassword: "", mem_email: "",
    mem_nick: "", mem_gender: "", mem_birthdate: "", mem_addr: "", mem_phone: "",
  });
  // 중복 확인 결과 상태
  const [idCheckStatus, setIdCheckStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [nicknameCheckStatus, setNicknameCheckStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  // 메시지 상태
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");

  const navigate = useNavigate();
  const { signup, checkDuplicate } = useAuth();

  // *** handleChange 함수 정의 ***
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 입력값 변경 시 중복 확인 상태 초기화
    if (name === "mem_id") { setIdCheckStatus('idle'); setIdCheckMessage(""); }
    else if (name === "mem_email") { setEmailCheckStatus('idle'); setEmailCheckMessage(""); }
    else if (name === "mem_nick") { setNicknameCheckStatus('idle'); setNicknameCheckMessage(""); }
  };

  // *** 비밀번호 일치 확인 useEffect ***
  useEffect(() => {
    if (formData.mem_pw && formData.confirmPassword) {
      setPasswordMatchMessage(
        formData.mem_pw === formData.confirmPassword
          ? "비밀번호가 일치합니다."
          : "비밀번호가 일치하지 않습니다."
      );
    } else {
      setPasswordMatchMessage("");
    }
  }, [formData.mem_pw, formData.confirmPassword]);


  // --- 중복 확인 핸들러 (API 호출 로직으로 수정) ---
  const handleCheckId = async () => {
    if (!formData.mem_id) { alert("아이디를 입력해주세요."); return; }
    setIdCheckStatus('checking'); // 확인 중 상태
    setIdCheckMessage("아이디 중복 확인 중...");
    const result = await checkDuplicate('id', formData.mem_id);
    setIdCheckMessage(result.message);
    setIdCheckStatus(result.available ? 'available' : 'unavailable');
  };

  const handleCheckEmail = async () => {
    if (!formData.mem_email) { alert("이메일을 입력해주세요."); return; }
    setEmailCheckStatus('checking');
    setEmailCheckMessage("이메일 중복 확인 중...");
    // 이메일 형식 검사 (간단하게)
    if (!/\S+@\S+\.\S+/.test(formData.mem_email)) {
        setEmailCheckMessage("올바른 이메일 형식이 아닙니다.");
        setEmailCheckStatus('unavailable');
        return;
    }
    const result = await checkDuplicate('email', formData.mem_email);
    setEmailCheckMessage(result.message);
    setEmailCheckStatus(result.available ? 'available' : 'unavailable');
  };

  const handleCheckNickname = async () => {
    if (!formData.mem_nick) { alert("닉네임을 입력해주세요."); return; }
    setNicknameCheckStatus('checking');
    setNicknameCheckMessage("닉네임 중복 확인 중...");
    const result = await checkDuplicate('nickname', formData.mem_nick);
    setNicknameCheckMessage(result.message);
    setNicknameCheckStatus(result.available ? 'available' : 'unavailable');
  };
  // --------------------------------------------------------

  // *** 회원가입 제출 핸들러 ***
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 비밀번호 일치 확인
    if (formData.mem_pw !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다."); return;
    }
    // 중복 확인 완료 여부 검사
    if (idCheckStatus !== 'available') {
      alert("아이디 중복 확인을 완료해주세요."); return;
    }
    if (emailCheckStatus !== 'available') {
      alert("이메일 중복 확인을 완료해주세요."); return;
    }
    if (nicknameCheckStatus !== 'available') {
      alert("닉네임 중복 확인을 완료해주세요."); return;
    }

    // 필수 필드 입력 여부 확인 (간단하게)
    const requiredFields: (keyof typeof formData)[] = [
      "mem_id", "mem_pw", "mem_email", "mem_nick", "mem_gender",
      "mem_birthdate", "mem_addr", "mem_phone"
    ];
    for (const key of requiredFields) {
        if (!formData[key]) {
            // 간단한 알림 대신 필드별 메시지 표시 가능
            alert(`필수 항목(${key})을 입력해주세요.`);
            return;
        }
    }

    // 전화번호 형식 검증 (정규식 활용)
    if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.mem_phone)) {
        alert("연락처 형식이 올바르지 않습니다. (예: 010-1234-5678)");
        return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      alert(`회원가입에 실패했습니다: ${error.message || '다시 시도해주세요.'}`);
    }
  };

  // *** 피드백 메시지 스타일 결정 함수 ***
  const getFeedbackStyle = (status: 'idle' | 'checking' | 'available' | 'unavailable') => {
      if (status === 'available') return styles.success;
      if (status === 'unavailable') return styles.error;
      return ''; // idle 또는 checking 상태
  };

  // *** 클릭 가능한 텍스트 버튼의 클래스 결정 함수 ***
  const getCheckTextButtonStyle = (status: 'idle' | 'checking' | 'available' | 'unavailable', value: string) => {
    let classNames = [styles.checkTextButton]; // 기본 클래스
    if (status === 'checking' || !value) {
      classNames.push(styles.disabled); // 비활성화 스타일 클래스 추가
    }
    return classNames.join(' '); // 클래스 이름들을 공백으로 연결하여 반환
  };

  return (
    <div className={styles.authContainer}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 아이디 */}
        <div className={styles.inputGroup}>
          <input
            name="mem_id" type="text" placeholder="아이디"
            value={formData.mem_id} onChange={handleChange} required // <-- 여기 포함 모든 input의 onChange 확인
            disabled={idCheckStatus === 'checking'}
          />
          {/* 버튼 대신 span 사용 */}
          <span
            onClick={idCheckStatus !== 'checking' && formData.mem_id ? handleCheckId : undefined}
            className={getCheckTextButtonStyle(idCheckStatus, formData.mem_id)}
          >
            {idCheckStatus === 'checking' ? "확인중..." : "아이디 중복 확인"}
          </span>
        </div>
        {idCheckMessage && (
          <p className={`${styles.feedbackMessage} ${getFeedbackStyle(idCheckStatus)}`}>
            {idCheckMessage}
          </p>
        )}

        {/* 비밀번호 */}
        <input
          name="mem_pw" type="password" placeholder="비밀번호"
          value={formData.mem_pw} onChange={handleChange} required
        />

        {/* 비밀번호 확인 */}
        <input
          name="confirmPassword" type="password" placeholder="비밀번호 확인"
          value={formData.confirmPassword} onChange={handleChange} required
        />
        {passwordMatchMessage && (
          <p className={`${styles.feedbackMessage} ${formData.mem_pw === formData.confirmPassword && formData.confirmPassword ? styles.success : styles.error}`}>
            {passwordMatchMessage}
          </p>
        )}

        {/* 이메일 */}
        <div className={styles.inputGroup}>
          <input
            name="mem_email" type="email" placeholder="이메일"
            value={formData.mem_email} onChange={handleChange} required
            disabled={emailCheckStatus === 'checking'}
          />
          {/* 버튼 대신 span 사용 */}
          <span
            onClick={emailCheckStatus !== 'checking' && formData.mem_email ? handleCheckEmail : undefined}
            className={getCheckTextButtonStyle(emailCheckStatus, formData.mem_email)}
          >
            {emailCheckStatus === 'checking' ? "확인중..." : "이메일 중복 확인"}
          </span>
        </div>
        {emailCheckMessage && (
          <p className={`${styles.feedbackMessage} ${getFeedbackStyle(emailCheckStatus)}`}>
            {emailCheckMessage}
          </p>
        )}

        {/* 닉네임 */}
        <div className={styles.inputGroup}>
          <input
            name="mem_nick" type="text" placeholder="닉네임"
            value={formData.mem_nick} onChange={handleChange} required
            disabled={nicknameCheckStatus === 'checking'}
          />
          {/* 버튼 대신 span 사용 */}
          <span
            onClick={nicknameCheckStatus !== 'checking' && formData.mem_nick ? handleCheckNickname : undefined}
            className={getCheckTextButtonStyle(nicknameCheckStatus, formData.mem_nick)}
          >
            {nicknameCheckStatus === 'checking' ? "확인중..." : "닉네임 중복 확인"}
          </span>
        </div>
        {nicknameCheckMessage && (
          <p className={`${styles.feedbackMessage} ${getFeedbackStyle(nicknameCheckStatus)}`}>
            {nicknameCheckMessage}
          </p>
        )}

        {/* 성별 */}
        <div className={styles.genderButtons}>
          <label>
            <input type="radio" name="mem_gender" value="M" checked={formData.mem_gender === "M"} onChange={handleChange} required /> 남자
          </label>
          <label>
            <input type="radio" name="mem_gender" value="F" checked={formData.mem_gender === "F"} onChange={handleChange} required /> 여자
          </label>
        </div>

        {/* 생년월일 */}
        <input
          name="mem_birthdate" type="date" value={formData.mem_birthdate}
          onChange={handleChange} required
          max={new Date().toISOString().split("T")[0]} // 오늘 이후 날짜 선택 불가
        />

        {/* 주소 */}
        <input
          name="mem_addr" type="text" placeholder="주소"
          value={formData.mem_addr} onChange={handleChange} required
        />

        {/* 연락처 */}
        <input
          name="mem_phone" type="tel" placeholder="연락처 (010-1234-5678)"
          value={formData.mem_phone} onChange={handleChange}
          pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}" title="010-1234-5678 형식으로 입력해주세요." required
        />

        <button
          type="submit"
          className={styles.submitButton}
          disabled={
              idCheckStatus !== 'available' ||
              emailCheckStatus !== 'available' ||
              nicknameCheckStatus !== 'available' ||
              formData.mem_pw !== formData.confirmPassword ||
              !formData.mem_pw
          }
        >
          회원가입
        </button>
      </form>
      {/* 로그인/메인 이동 링크 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '20px' }}>
        <p style={{ cursor: 'pointer', margin: 0 }} onClick={() => navigate("/login")}>이미 계정이 있으신가요? 로그인</p>
        <p style={{ cursor: 'pointer', margin: 0 }} onClick={() => navigate("/")}>메인으로</p>
      </div>
    </div>
  );
};

export default Signup;