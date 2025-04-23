import React, { useState } from 'react';
import AiJasoseoForm from '../components/Home/AiJasoseoForm';
import AiJasoseoResult from '../components/Home/AiJasoseoResult';
import styles from './AiJasoseo.module.scss';
import AiJasoseoNavbar from '../components/AiJasoseo/AiJasoseoNavbar';
import type { FormData } from '../types/types';
import { ChangeEvent } from 'react'; // Import ChangeEvent


const AiJasoseoPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    field: '',
    company: '',
    questions: '',
    skills: '',
    cvFile: null, 
    portfolioFile: null,
    resumeFile: null,
    emphasisPoints: '',
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof FormData
  ) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof FormData
  ) => {
    // 파일이 선택되었는지 확인
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, [key]: e.target.files[0] });
    }
  };

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("mem_id", sessionStorage.getItem("login_id") || "");
      formPayload.append("questions", formData.questions);
      formPayload.append("skills", formData.skills);
      formPayload.append("field", formData.field);
      formPayload.append("company", formData.company);
      formPayload.append("emphasisPoints", formData.emphasisPoints);
      if (formData.cvFile) formPayload.append("cv", formData.cvFile); // ✅ 이력서 추가
      if (formData.resumeFile) formPayload.append("resume", formData.resumeFile);
      if (formData.portfolioFile) formPayload.append("portfolio", formData.portfolioFile);
  
      const response = await fetch("http://localhost:9000/jasoseo/generate-draft", {
        method: "POST",
        body: formPayload, // ✅ FormData는 Content-Type을 자동 설정해줌
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setResult(data.draft);
    } catch (error) {
      console.error('Error:', error);
      alert('자소서 초안 생성에 실패했습니다.');
      setResult('자소서 초안 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.AiJasoseo}>
      <div className={styles.ai_jasoseo_container}>
        <AiJasoseoNavbar />
        <div className={styles.ai_jasoseo_right}>
          <div className={styles.ai_jasoseo_right_wrapper}>
            <AiJasoseoForm
              formData={formData}
              onChange={handleInputChange}
              onGenerate={handleGenerateDraft}
            />
            <AiJasoseoResult result={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiJasoseoPage;