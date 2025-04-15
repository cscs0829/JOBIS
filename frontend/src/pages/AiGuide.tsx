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
            formData.append('resume', resumeFile as Blob);
            formData.append('portfolio', portfolioFile as Blob);
            formData.append('field', field);
            formData.append('company', company);
            formData.append('strengths', strengths);

            const response = await fetch('/api/generate-guide', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: AiGuideResponse = await response.json(); //  Type the response
            setResult(data.guide);
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
                            onFieldChange={handleFieldChange}
                            onCompanyChange={handleCompanyChange}
                            onStrengthsChange={handleStrengthsChange}
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