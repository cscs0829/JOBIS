import React from 'react';
import styles from './AiFeedbackResult.module.scss'; //  NEW import

interface AiFeedbackResultProps { //  NEW interface
    result: string | null;
    loading: boolean;
}

const AiFeedbackResult: React.FC<AiFeedbackResultProps> = ({ result, loading }) => {
    return (
        <div className={styles.resultContainer}>
            <h2>AI 자소서 피드백 결과</h2>
            {loading ? (
                <div>JOBIS가 자기소개서 피드백을 작성중입니다! 잠시만 기다려주세요!</div>
            ) : (
                <div className={styles.resultText}>
                    {result ? result : 'AI 자소서 피드백 결과가 여기에 표시됩니다.'}
                </div>
            )}
        </div>
    );
};

export default AiFeedbackResult;