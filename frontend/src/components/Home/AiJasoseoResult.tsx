import React, {useEffect, useState} from 'react';
import styles from './AiJasoseoResult.module.scss'; // 이 CSS 파일 생성
import { useNavigate } from 'react-router-dom'; // 🔹 페이지 이동용

interface AiJasoseoResultProps {
  result: string | null;
  loading: boolean; // loading 속성 추가
}


const AiJasoseoResult: React.FC<AiJasoseoResultProps> = ({ result, loading }) => {
  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 useNavigate 훅 사용
  const [displayedText, setDisplayedText] = useState('');
  
  // ✅ 타자 효과 useEffect
  useEffect(() => {
    if (!result) return;

    let index = 0;
    setDisplayedText('');

    // 내부 setInterval을 관리할 변수
    let intervalId: NodeJS.Timeout;

    const startTyping = () => {
      intervalId = setInterval(() => {
        if (index < result.length) {
          const char = result.charAt(index);
          setDisplayedText(prev => prev + char);
          index++; // ✅ 글자 추가 후 증가
        } else {
          clearInterval(intervalId);
        }
      }, 30);
    };

    // 시작 딜레이 (첫 글자 깜빡임 방지용)
    const delayTimeout = setTimeout(startTyping, 100);

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(intervalId);
    };
  }, [result]);


  // 🔽 복사 함수 추가
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert("자기소개서 내용이 복사되었습니다!");
    }
  };

  // 🔽 AI면접서비스 페이지 이동
  const goToInterview = () => {
    navigate("/interview"); // 🔹 면접 페이지로 이동
  };

  // 🔽 여기에 추가!
  console.log("📄 생성된 자소서 초안:", result);

  return (
    <div className={styles.resultContainer}>
      <h2>AI 자소서 작성 내용</h2>
      {loading ? (
        <div>JOBIS가 자기소개서를 작성중입니다! 잠시만 기다려주세요!</div> // 로딩 중일 때 표시할 내용
      ) : (
        <div className={styles.resultText}>
          {displayedText || 'AI 자소서 내용이 여기에 표시됩니다.'}
        </div>
      )}

      {/* 🔽 복사 및 이동 버튼 추가 */}
      {!loading && result && (
        <div className={styles.buttonGroup}>
          <button onClick={handleCopy} className={styles.copyButton}>복사하기</button>
          <button onClick={goToInterview} className={styles.interviewButton}>AI 면접 서비스로 이동</button>
        </div>
      )}
    </div>
  );
};

export default AiJasoseoResult;
