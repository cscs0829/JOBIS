import React, { useState, ChangeEvent } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { FormData } from '../../types/types';
import styles from './AiJasoseoForm.module.scss';
import FileUploadModal from '../Input/FileUploadModal';
import { FileInputProps } from '../../types/types'; // Import FileInputProps

interface AiJasoseoFormProps {
  formData: FormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof FormData) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, key: keyof FormData) => void; // ✅ 추가
  onGenerate: () => void;
}

const AiJasoseoForm: React.FC<AiJasoseoFormProps> = ({
  formData,
  onChange,
  onFileChange,
  onGenerate,
}) => {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvFiles, setCvFiles] = useState<File[]>([]);

  const handleCvUpload = (files: File[]) => {
    setCvFiles(files);
  };
  
  const handleResumeUpload = (files: File[]) => {
    setResumeFiles(files);
  };

  const handlePortfolioUpload = (files: File[]) => {
    setPortfolioFiles(files);
  };

  const handleSaveCv = (files: File[]) => {
    console.log('이력서 파일 저장:', files);
  };

  const handleSaveResume = (files: File[]) => {
    // 이력서 파일 저장 로직
    console.log('자기소개서 파일 저장:', files);
    // 여기에 실제 파일 저장 로직을 구현하세요 (예: API 호출)
  };

  const handleSavePortfolio = (files: File[]) => {
    // 포트폴리오 파일 저장 로직
    console.log('포트폴리오 파일 저장:', files);
    // 여기에 실제 파일 저장 로직을 구현하세요 (예: API 호출)
  };

  return (
    <div className={styles.formContainer}>
      <h2>AI 자소서 작성</h2>

{/* 1. 이력서 파일 첨부 */}
      <div>
  <label htmlFor="cvFile">이력서 파일 첨부</label>
  <button onClick={() => setShowCvModal(true)} id="cvFile">
    {cvFiles.length > 0
      ? cvFiles.map(file => file.name).join(', ')
      : '이력서 첨부'}
  </button>
  <FileUploadModal
  isOpen={showCvModal}
  onClose={() => setShowCvModal(false)}
  onFileUpload={(files) => {
    setCvFiles(files); // 미리보기용만
  }}
  onSaveFiles={(files) => {
    setCvFiles(files);
    if (files.length > 0) {
      const syntheticEvent = {
        target: { value: "", files: [files[0]] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileChange(syntheticEvent, 'cvFile'); // ✅ 여기에서 실제 반영
    }
  }}
/>

</div>

{/* 2. 자기소개서 파일 첨부 */}
<div>
  <label htmlFor="resumeFile">자기소개서 파일 첨부</label>
  <button onClick={() => setShowResumeModal(true)} id="resumeFile">
    {resumeFiles.length > 0
      ? resumeFiles.map(file => file.name).join(', ')
      : '자기소개서 첨부'}
  </button>
  <FileUploadModal
  isOpen={showResumeModal}
  onClose={() => setShowResumeModal(false)}
  onFileUpload={(files) => {
    setResumeFiles(files); // 미리보기용
  }}
  onSaveFiles={(files) => {
    setResumeFiles(files);
    if (files.length > 0) {
      const syntheticEvent = {
        target: { value: "", files: [files[0]] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileChange(syntheticEvent, 'resumeFile'); // ✅ 실제 반영
    }
  }}
/>
</div>

{/* 3. 포트폴리오 파일 첨부 */}
<div>
  <label htmlFor="portfolioFile">포트폴리오 파일 첨부</label>
  <button onClick={() => setShowPortfolioModal(true)} id="portfolioFile">
    {portfolioFiles.length > 0
      ? portfolioFiles.map(file => file.name).join(', ')
      : '포트폴리오 첨부'}
  </button>
  <FileUploadModal
  isOpen={showPortfolioModal}
  onClose={() => setShowPortfolioModal(false)}
  onFileUpload={(files) => {
    setPortfolioFiles(files); // 미리보기용
  }}
  onSaveFiles={(files) => {
    setPortfolioFiles(files);
    if (files.length > 0) {
      const syntheticEvent = {
        target: { value: "", files: [files[0]] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileChange(syntheticEvent, 'portfolioFile'); // ✅ 실제 반영
    }
  }}
/>
</div>
      <Input
        label="질문 (예: 지원동기, 성장과정 등)"
        value={formData.questions}
        onChange={(e) => onChange(e, 'questions')}
        isTextArea={true}
      />
      <Input
      
        label="보유 스킬"
        value={formData.skills}
        onChange={(e) => onChange(e, 'skills')}
      />
      <Input
        label="지원하는 분야 (선택)"
        value={formData.field}
        onChange={(e) => onChange(e, 'field')}
      />
      <Input
        label="지원하는 회사 (선택)"
        value={formData.company}
        onChange={(e) => onChange(e, 'company')}
      />
      <Input
        label="강조 포인트 (선택)"
        value={formData.emphasisPoints}
        onChange={(e) => onChange(e, 'emphasisPoints')}
      />

      <Button onClick={onGenerate}>자소서 작성하기</Button>
    </div>
  );
};

export default AiJasoseoForm;