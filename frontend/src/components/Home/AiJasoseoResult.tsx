
import React from 'react';
import styles from './AiJasoseoResult.module.scss'; // 이 CSS 파일 생성


interface AiJasoseoResultProps {
    result: string | null;
    loading: boolean; // loading 속성 추가
  }

  const AiJasoseoResult: React.FC<AiJasoseoResultProps> = ({ result, loading }) => {
    return (
      <div className={styles.resultContainer}>
        <h2>AI 자기소개서 초안</h2>
        {loading ? (
          <div>Loading...</div> // 로딩 중일 때 표시할 내용
        ) : (
          <div className={styles.resultText}>
            {result ? result : 'AI 자소서 초안이 여기에 표시됩니다.'}
          </div>
        )}
      </div>
    );
  };

export default AiJasoseoResult;