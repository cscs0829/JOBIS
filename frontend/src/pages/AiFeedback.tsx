import React, { useState } from 'react';
import AiFeedbackForm from '../components/Home/AiFeedbackForm';
import AiFeedbackResult from '../components/Home/AiFeedbackResult';
import styles from './AiFeedback.module.scss'; // 페이지 스타일 import 확인
import AiGuideNavbar from '../components/AiFeedback/AiFeedbackNavbar'; // Navbar import 확인

const AiFeedbackPage: React.FC = () => {
  const [field, setField] = useState('');
  const [company, setCompany] = useState('');
  const [emphasisPoints, setEmphasisPoints] = useState('');
  const [requirements, setRequirements] = useState('');
  // --- 이력서 파일 상태 (단일 파일만 처리한다고 가정) ---
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // ---------------------------------------------
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateFeedback = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      const loginId = sessionStorage.getItem("login_id") || ""; // 로그인 ID 가져오기
      formData.append("mem_id", loginId);
      formData.append("field", field);
      formData.append("company", company);
      formData.append("emphasisPoints", emphasisPoints);
      formData.append("requirements", requirements);
      // --- resumeFile 상태 변수 사용 확인 ---
      if (resumeFile) {
          formData.append("resume", resumeFile); // 'resume' 키로 파일 추가
          console.log("Appending resume file:", resumeFile.name); // 디버깅 로그 추가
      } else {
          console.log("No resume file to append."); // 디버깅 로그 추가
      }
      // ------------------------------------

      console.log("Sending FormData:", Object.fromEntries(formData)); // 전송 데이터 확인 (파일 제외)

      const response = await fetch("http://localhost:9000/feedback/generate", {
        method: "POST",
        body: formData, // Content-Type은 FormData 사용 시 브라우저가 자동 설정
      });

      if (!response.ok) { // 응답 상태 코드 확인
          const errorText = await response.text();
          throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResult(data.feedback); // 백엔드 응답 키 확인 필요
    } catch (err) {
      console.error("피드백 요청 실패:", err);
      alert(`AI 피드백 요청 실패: ${err instanceof Error ? err.message : String(err)}`);
      setResult("피드백 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  // --- onResumeUpload 핸들러 수정 ---
  // 이제 File 배열을 인자로 받음
  const handleResumeUpload = (files: File[]) => {
      if (files.length > 0) {
          // 첫 번째 파일만 사용한다고 가정
          setResumeFile(files[0]);
          console.log("Resume file set:", files[0].name);
      } else {
          setResumeFile(null);
          console.log("Resume file cleared.");
      }
  };
  // ------------------------------

  return (
    // 클래스 이름 확인 (AiGuide or AiFeedback)
    <div className={styles.AiGuide}>
      <div className={styles.ai_guide_container}>
        {/* Navbar 컴포넌트 이름 확인 */}
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
              // --- 수정된 핸들러 전달 ---
              onResumeUpload={handleResumeUpload}
              // -----------------------
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