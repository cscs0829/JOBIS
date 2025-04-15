import React from 'react';
import GuideInput from '../Input/GuideInput'; // Updated import
import GuideFileInput from '../Input/GuideFileInput';
import Button from '../Button/Button';
import { AiGuideFormProps } from '../../types/types';
import styles from './AiGuideForm.module.scss';

const AiGuideForm: React.FC<AiGuideFormProps> = ({
    field,
    company,
    strengths,
    onFieldChange,
    onCompanyChange,
    onStrengthsChange,
    onResumeUpload,
    onPortfolioUpload,
    onGenerateGuide
}) => {
    return (
        <div className={styles.formContainer}>
            <h2>AI 자소서 가이드</h2>
            <GuideFileInput label="자소서 첨부" id="resume" onChange={onResumeUpload} />
            <GuideFileInput label="포트폴리오 첨부" id="portfolio" onChange={onPortfolioUpload} />
            <GuideInput label="지원하는 분야" value={field} onChange={onFieldChange} /> 
            <GuideInput label="지원하는 회사" value={company} onChange={onCompanyChange} /> 
            <GuideInput
                label="강조하고 싶은 나만의 강점"
                value={strengths}
                onChange={onStrengthsChange}
                isTextArea={true} // Updated component name
            />
            <Button onClick={onGenerateGuide}>가이드 작성하기</Button>
        </div>
    );
};

export default AiGuideForm;