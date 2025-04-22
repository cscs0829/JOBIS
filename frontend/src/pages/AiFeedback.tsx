import React, { useState } from 'react';
import AiFeedbackForm from '../components/Home/AiFeedbackForm';
import AiFeedbackResult from '../components/Home/AiFeedbackResult';
import styles from './AiFeedback.module.scss';
import AiGuideNavbar from '../components/AiFeedback/AiFeedbackNavbar';

const AiFeedbackPage: React.FC = () => {
  const [field, setField] = useState('');
  const [company, setCompany] = useState('');
  const [emphasisPoints, setEmphasisPoints] = useState('');
  const [requirements, setRequirements] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateFeedback = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      const loginId = sessionStorage.getItem("login_id") || "";
      formData.append("mem_id", loginId);
      formData.append("field", field);
      formData.append("company", company);
      formData.append("emphasisPoints", emphasisPoints);
      formData.append("requirements", requirements);
      if (resumeFile) formData.append("resume", resumeFile);

      const response = await fetch("http://localhost:9000/feedback/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.feedback); // 백엔드에서 feedback이라는 키로 전달해야 함
    } catch (err) {
      console.error("피드백 실패:", err);
      alert("AI 피드백 요청 실패");
      setResult("피드백 요청 실패");
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
            <AiFeedbackForm
              field={field}
              company={company}
              emphasisPoints={emphasisPoints}
              requirements={requirements}
              onFieldChange={e => setField(e.target.value)}
              onCompanyChange={e => setCompany(e.target.value)}
              onEmphasisChange={e => setEmphasisPoints(e.target.value)}
              onRequirementChange={e => setRequirements(e.target.value)}
              onResumeUpload={e => {
                const file = e.target.files?.[0];
                if (file) setResumeFile(file);
              }}
              onGenerateFeedback={handleGenerateFeedback}
            />
            <AiFeedbackResult result={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiFeedbackPage;
