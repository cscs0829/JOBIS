import React from 'react';
import styles from './AiGuideResult.module.scss'; //  NEW import

interface AiGuideResultProps { //  NEW interface
    result: string | null;
    loading: boolean;
}

const AiGuideResult: React.FC<AiGuideResultProps> = ({ result, loading }) => {
    return (
        <div className={styles.resultContainer}>
            <h2>AI 자소서 가이드 결과</h2>
            {loading ? (
                <div>JOBIS가 자기소개서를 작성중입니다! 잠시만 기다려주세요!</div>
            ) : (
                <div className={styles.resultText}>
                    {result ? result : 'AI 자소서 가이드 결과가 여기에 표시됩니다.'}
                </div>
            )}
        </div>
    );
};

export default AiGuideResult;