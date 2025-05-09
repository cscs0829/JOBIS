import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // 경로 확인
import styles from './UserInfoEditForm.module.scss'; // UserInfoEditForm 스타일
// Signup 스타일을 임시로 가져오거나 UserInfoEditForm.module.scss에 필요한 스타일 정의
import { useNavigate, useLocation } from "react-router-dom";
import signupStyles from '../../pages/Signup.module.scss';

const UserInfoEditForm = () => {
    const { userInfo, updateUserInfo, checkDuplicate, logout } = useAuth();
    const [formData, setFormData] = useState({
        mem_pw: '',
        confirmPassword: '',
        mem_email: '',
        mem_nick: '',
        mem_addr: '',
        mem_phone: '',
    });
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
    const [nicknameCheckStatus, setNicknameCheckStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
    const [emailCheckMessage, setEmailCheckMessage] = useState('');
    const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const navigate = useNavigate();
    // 폼 초기화
    useEffect(() => {
        if (userInfo) {
            setFormData(prev => ({
                ...prev,
                mem_email: userInfo.email || '',
                mem_nick: userInfo.nickname || '',
                mem_addr: userInfo.addr || '',
                mem_phone: userInfo.phone || '',
            }));
            setEmailCheckStatus('available');
            setNicknameCheckStatus('available');
            setEmailCheckMessage('');
            setNicknameCheckMessage('');
        }
    }, [userInfo]);

    // 비밀번호 확인 메시지
    useEffect(() => {
        if (formData.mem_pw || formData.confirmPassword) {
            setPasswordMatchMessage(
                formData.mem_pw === formData.confirmPassword
                    ? '비밀번호가 일치합니다.'
                    : '비밀번호가 일치하지 않습니다.'
            );
        } else {
            setPasswordMatchMessage('');
        }
    }, [formData.mem_pw, formData.confirmPassword]);

    // 입력 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'mem_email') {
            if (value !== userInfo?.email) {
                setEmailCheckStatus('idle');
                setEmailCheckMessage('');
            } else {
                 setEmailCheckStatus('available');
                 setEmailCheckMessage('');
            }
        }
        if (name === 'mem_nick') {
             if (value !== userInfo?.nickname) {
                setNicknameCheckStatus('idle');
                setNicknameCheckMessage('');
             } else {
                 setNicknameCheckStatus('available');
                 setNicknameCheckMessage('');
             }
        }
    };

    // 이메일 중복 확인 핸들러
    const handleCheckEmail = async () => {
        if (!formData.mem_email || formData.mem_email === userInfo?.email) return;
        setEmailCheckStatus('checking');
        setEmailCheckMessage('이메일 중복 확인 중...');
        if (!/\S+@\S+\.\S+/.test(formData.mem_email)) {
            setEmailCheckMessage("올바른 이메일 형식이 아닙니다.");
            setEmailCheckStatus('unavailable');
            return;
        }
        // 🚨 중요: 백엔드는 자기 자신 제외 로직 필요
        const result = await checkDuplicate('email', formData.mem_email);
        setEmailCheckMessage(result.message);
        setEmailCheckStatus(result.available ? 'available' : 'unavailable');
    };

    // 닉네임 중복 확인 핸들러
    const handleCheckNickname = async () => {
        if (!formData.mem_nick || formData.mem_nick === userInfo?.nickname) return;
        setNicknameCheckStatus('checking');
        setNicknameCheckMessage('닉네임 중복 확인 중...');
        // 🚨 중요: 백엔드는 자기 자신 제외 로직 필요
        const result = await checkDuplicate('nickname', formData.mem_nick);
        setNicknameCheckMessage(result.message);
        setNicknameCheckStatus(result.available ? 'available' : 'unavailable');
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitMessage('');
        if (!userInfo?.id) {
            alert('로그인 정보가 유효하지 않습니다.'); return;
        }
        // 유효성 검사
        if (formData.mem_pw && formData.mem_pw !== formData.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.'); return;
        }
        if (formData.mem_email !== userInfo?.email && emailCheckStatus !== 'available') {
             alert('변경된 이메일의 중복 확인을 완료해주세요.'); return;
        }
        if (formData.mem_nick !== userInfo?.nickname && nicknameCheckStatus !== 'available') {
             alert('변경된 닉네임의 중복 확인을 완료해주세요.'); return;
        }
        if (formData.mem_phone && !/^\d{3}-\d{4}-\d{4}$/.test(formData.mem_phone)) {
           alert("연락처 형식이 올바르지 않습니다. (예: 010-1234-5678)"); return;
        }

        setIsSubmitting(true);
        try {
            // 전송할 페이로드 객체 생성
             const updatePayload: {
                mem_email: string;
                mem_nick: string;
                mem_addr: string;
                mem_phone: string;
                mem_pw?: string; // 비밀번호는 optional
            } = {
                mem_email: formData.mem_email,
                mem_nick: formData.mem_nick,
                mem_addr: formData.mem_addr,
                mem_phone: formData.mem_phone,
            };

            // 비밀번호 필드에 값이 있을 경우에만 페이로드에 추가
            if (formData.mem_pw) {
                updatePayload.mem_pw = formData.mem_pw;
            }

            await updateUserInfo(userInfo.id, updatePayload); // 수정된 payload 전달

            setSubmitMessage('회원 정보가 성공적으로 수정되었습니다.');
            alert('회원 정보가 성공적으로 수정되었습니다.');
            navigate('/'); // 메인 페이지로 이동
            // 비밀번호 변경 성공 시 재로그인 유도
            if (updatePayload.mem_pw) {
                 alert('비밀번호가 변경되었습니다. 보안을 위해 다시 로그인해주세요.');
                 logout();
            }
        } catch (error: any) {
            console.error('회원 정보 수정 실패:', error);
            setSubmitMessage(`수정 실패: ${error.message || '다시 시도해주세요.'}`);
            alert(`수정 실패: ${error.message || '다시 시도해주세요.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 피드백 메시지 스타일
    const getFeedbackStyle = (status: 'idle' | 'checking' | 'available' | 'unavailable') => {
        // signupStyles 대신 UserInfoEditForm.module.scss 클래스 사용 권장
        if (status === 'available') return signupStyles.success;
        if (status === 'unavailable') return signupStyles.error;
        return '';
    };

     // 폼 제출 버튼 활성화 조건
    const isSubmitDisabled = () => {
        if (isSubmitting) return true;
        if (formData.mem_pw && formData.mem_pw !== formData.confirmPassword) return true;
        if (formData.mem_email !== userInfo?.email && emailCheckStatus !== 'available') return true;
        if (formData.mem_nick !== userInfo?.nickname && nicknameCheckStatus !== 'available') return true;
        return false;
    };


    return (
        <div className={styles.formContainer}>
            <h2>회원 정보 수정</h2>
            <form onSubmit={handleSubmit}>
                {/* 새 비밀번호 */}
                <label htmlFor="mem_pw">새 비밀번호 (변경 시 입력)</label>
                <input
                    id="mem_pw" name="mem_pw" type="password" placeholder="새 비밀번호"
                    value={formData.mem_pw} onChange={handleChange}
                />

                {/* 새 비밀번호 확인 */}
                <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                <input
                    id="confirmPassword" name="confirmPassword" type="password" placeholder="새 비밀번호 확인"
                    value={formData.confirmPassword} onChange={handleChange}
                    disabled={!formData.mem_pw}
                />
                 {passwordMatchMessage && (
                    <p className={`${signupStyles.feedbackMessage} ${formData.mem_pw === formData.confirmPassword ? signupStyles.success : signupStyles.error}`}>
                        {passwordMatchMessage}
                    </p>
                )}

                {/* 이메일 */}
                <label htmlFor="mem_email">이메일</label>
                 <div className={signupStyles.inputGroup}> {/* UserInfoEditForm.module.scss 스타일 정의 필요 */}
                    <input
                        id="mem_email" name="mem_email" type="email" placeholder="이메일"
                        value={formData.mem_email} onChange={handleChange} required
                        disabled={emailCheckStatus === 'checking'}
                    />
                    {formData.mem_email !== userInfo?.email && (
                         <button
                            type="button" onClick={handleCheckEmail} className={signupStyles.checkButton} // UserInfoEditForm.module.scss 스타일 정의 필요
                            disabled={!formData.mem_email || emailCheckStatus === 'checking'}
                         >
                            {emailCheckStatus === 'checking' ? "확인중..." : "이메일 중복 확인"}
                         </button>
                    )}
                 </div>
                 {emailCheckMessage && formData.mem_email !== userInfo?.email && (
                    <p className={`${signupStyles.feedbackMessage} ${getFeedbackStyle(emailCheckStatus)}`}>
                        {emailCheckMessage}
                    </p>
                )}

                {/* 닉네임 */}
                <label htmlFor="mem_nick">닉네임</label>
                 <div className={signupStyles.inputGroup}> {/* UserInfoEditForm.module.scss 스타일 정의 필요 */}
                    <input
                        id="mem_nick" name="mem_nick" type="text" placeholder="닉네임"
                        value={formData.mem_nick} onChange={handleChange} required
                        disabled={nicknameCheckStatus === 'checking'}
                    />
                     {formData.mem_nick !== userInfo?.nickname && (
                        <button
                            type="button" onClick={handleCheckNickname} className={signupStyles.checkButton} // UserInfoEditForm.module.scss 스타일 정의 필요
                            disabled={!formData.mem_nick || nicknameCheckStatus === 'checking'}
                        >
                             {nicknameCheckStatus === 'checking' ? "확인중..." : "닉네임 중복 확인"}
                        </button>
                     )}
                 </div>
                 {nicknameCheckMessage && formData.mem_nick !== userInfo?.nickname && (
                    <p className={`${signupStyles.feedbackMessage} ${getFeedbackStyle(nicknameCheckStatus)}`}>
                        {nicknameCheckMessage}
                    </p>
                )}

                {/* 주소 */}
                <label htmlFor="mem_addr">주소</label>
                <input
                    id="mem_addr" name="mem_addr" type="text" placeholder="주소"
                    value={formData.mem_addr} onChange={handleChange} required
                />

                {/* 연락처 */}
                <label htmlFor="mem_phone">연락처</label>
                <input
                    id="mem_phone" name="mem_phone" type="tel" placeholder="연락처 (010-1234-5678)"
                    value={formData.mem_phone} onChange={handleChange} required
                    pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}" title="010-1234-5678 형식으로 입력해주세요."
                />

                <button type="submit" className={styles.submitButton} disabled={isSubmitDisabled()}>
                    {isSubmitting ? '수정 중...' : '수정하기'}
                </button>
                {/* submitMessage 스타일 정의 필요 */}
                {submitMessage && <p className={styles.submitFeedback}>{submitMessage}</p>}
            </form>
        </div>
    );
};

export default UserInfoEditForm;