import React, { useState } from 'react';
import AiJasoseoForm from '../components/Home/AiJasoseoForm';
import AiJasoseoResult from '../components/Home/AiJasoseoResult';
import styles from './AiJasoseo.module.scss';
import AiJasoseoNavbar from '../components/AiJasoseo/AiJasoseoNavbar';
import type { FormData } from '../types/types';
import { ChangeEvent } from 'react';

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
  const [fileIdx, setFileIdx] = useState<number | null>(null); // ✅ 수정됨: file_idx 저장용

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof FormData
  ) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof FormData
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, [key]: file });

      // ✅ 파일 업로드 후 file_idx 받아오기
      const uploadForm = new FormData();
      uploadForm.append("mem_id", sessionStorage.getItem("login_id") || "");
      uploadForm.append(key.replace("File", ""), file); // resumeFile -> resume, cvFile -> cv 등

      const response = await fetch("http://localhost:9000/upload/file", {
        method: "POST",
        body: uploadForm,
      });

      const data = await response.json();
      if (data.file_idx) {
        setFileIdx(data.file_idx);
        console.log("✅ file_idx 저장 완료:", data.file_idx);
      }
    }
  };

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("mem_id", sessionStorage.getItem("login_id") || "");
      if (fileIdx !== null) formPayload.append("file_idx", fileIdx.toString()); // ✅ 저장된 file_idx

      // ✅ 파일도 같이 전송 (추가된 부분)
      if (formData.cvFile) {
        formPayload.append("cv", formData.cvFile);
      }
      if (formData.resumeFile) {
        formPayload.append("resume", formData.resumeFile);
      }
      if (formData.portfolioFile) {
        formPayload.append("portfolio", formData.portfolioFile);
      }

      // 기존 텍스트 필드들
      formPayload.append("questions", formData.questions);
      formPayload.append("skills", formData.skills);
      formPayload.append("field", formData.field);
      formPayload.append("company", formData.company);
      formPayload.append("emphasisPoints", formData.emphasisPoints);
      formPayload.append("qualifications", formData.qualifications || "");
      formPayload.append("projects", formData.projects || "");
      formPayload.append("experiences", formData.experiences || "");
      formPayload.append("major", formData.major || "");

      const response = await fetch("http://localhost:9000/jasoseo/generate-draft", {
        method: "POST",
        body: formPayload,
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
