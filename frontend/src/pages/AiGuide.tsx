import React, { useState } from 'react';
import AiGuideForm from '../components/Home/AiGuideForm'; //  UPDATED import
import AiGuideResult from '../components/Home/AiGuideResult'; //  UPDATED import
import styles from './AiGuide.module.scss'; //  NEW import
import AiGuideNavbar from '../components/AiGuide/AiGuideNavbar';
import { AiGuideResponse } from '../types/types'; //  UPDATED import

const AiGuidePage: React.FC = () => {
    const [field, setField] = useState('');
    const [company, setCompany] = useState('');
    const [strengths, setStrengths] = useState('');
    const [experiences, setExperiences] = useState('');
    const [selfIntro, setSelfIntro] = useState(''); 
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [portfolioFile, setPortfolioFile] = useState<File | null>(null);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setField(e.target.value);
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompany(e.target.value);
    };

    const handleStrengthsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStrengths(e.target.value);
    };

    const handleExperiencesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { 
        setExperiences(e.target.value);
    };

    const handleSelfIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSelfIntro(e.target.value);
    };

    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
        }
    };

    const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPortfolioFile(file);
        }
    };

    const handleGenerateGuide = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            const loginId = sessionStorage.getItem("login_id") || localStorage.getItem("login_id") || "";
formData.append('mem_id', loginId);
            formData.append('job_position', field);
            formData.append('dream_company', company);
            formData.append('strong_point', strengths);
            formData.append('career_level', experiences);
            formData.append('self_intro_text', selfIntro); // 복붙 입력값
            formData.append('portfolio_text', ""); // 파일 안 보냈을 때 대비용
            if (resumeFile) formData.append('self_intro', resumeFile); // PDF 업로드
            if (portfolioFile) formData.append('portfolio', portfolioFile);

            const response = await fetch("http://localhost:9000/guide/guide", {
            method: 'POST',
            body: formData, // ❌ 헤더 생략! FormData는 자동 처리됨
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResult(data.ai_result); // 백엔드에서 보내는 key 이름 그대로!
        } catch (error) {
            console.error('Error:', error);
            alert('자소서 가이드 생성에 실패했습니다.');
            setResult('자소서 가이드 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.AiGuide}>
            <div className={styles.ai_guide_container}>
                <AiGuideNavbar />
                <div className={styles.ai_guide_right}>
                    <div className={styles.ai_guide_right_wrapper}>
                    <AiGuideForm
                            field={field}
                            company={company}
                            strengths={strengths}
                            experiences={experiences} 
                            selfIntro={selfIntro}
                            onFieldChange={handleFieldChange}
                            onCompanyChange={handleCompanyChange}
                            onStrengthsChange={handleStrengthsChange}
                            onExperiencesChange={handleExperiencesChange} 
                            onSelfIntroChange={handleSelfIntroChange}
                            onGenerateGuide={handleGenerateGuide}
                            onResumeUpload={handleResumeUpload}
                            onPortfolioUpload={handlePortfolioUpload}
                        />
                        <AiGuideResult result={result} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiGuidePage;