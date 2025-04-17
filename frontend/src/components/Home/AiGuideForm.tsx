import React from 'react';
import GuideInput from '../Input/GuideInput';
import GuideFileInput from '../Input/GuideFileInput';
import Button from '../Button/Button';
import { AiGuideFormProps } from '../../types/types';
import styles from './AiGuideForm.module.scss';

const AiGuideForm: React.FC<AiGuideFormProps> = ({
    field,
    company,
    strengths,
    experiences, 
    selfIntro,
    onFieldChange,
    onCompanyChange,
    onStrengthsChange,
    onExperiencesChange, 
    onSelfIntroChange,
    onResumeUpload,
    onPortfolioUpload,
    onGenerateGuide
}) => {
    return (
        <div className={styles.formContainer}>
            <h2>AI 자소서 가이드</h2>
            <GuideFileInput label="자소서 첨부" id="resume" onChange={onResumeUpload} />
            <GuideInput label="자기소개서" value={selfIntro} onChange={onSelfIntroChange} isTextArea={true} />
            <GuideFileInput label="포트폴리오 첨부" id="portfolio" onChange={onPortfolioUpload} />
            <GuideInput label="지원하는 분야" value={field} onChange={onFieldChange} />
            <GuideInput label="지원하는 회사" value={company} onChange={onCompanyChange} />
            <GuideInput
                label="강조하고 싶은 나만의 강점"
                value={strengths}
                onChange={onStrengthsChange}
                isTextArea={true}
            />
            <GuideInput // 경력 입력 추가
                label="경력"
                value={experiences}
                onChange={onExperiencesChange}
                isTextArea={true}
            />
            <Button onClick={onGenerateGuide}>가이드 작성하기</Button>
        </div>
    );
};

export default AiGuideForm;