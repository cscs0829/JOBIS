import React, { useState } from 'react';
import AiJasoseoForm from '../components/Home/AiJasoseoForm';
import AiJasoseoResult from '../components/Home/AiJasoseoResult';
import styles from './AiJasoseo.module.scss';
import AiJasoseoNavbar from '../components/AiJasoseo/AiJasoseoNavbar';
import { FormData } from '../types/types';

const AiJasoseoPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    field: '',
    company: '',
    qualifications: '',
    projects: '',
    experiences: '',
    major: '',
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

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9000/jasoseo/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("🎯 초안 결과 응답:", data); // ✅ 이 줄 추가
      setResult(data.draft); // 응답에서 초안 텍스트를 가져옴
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