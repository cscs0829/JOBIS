import React, { useState } from 'react';
import GuideInput from '../Input/GuideInput';
// import GuideFileInput from '../Input/GuideFileInput'; // 사용하지 않으면 제거 가능
import Button from '../Button/Button';
import styles from './AiFeedbackForm.module.scss'; // scss 모듈 import 확인
import { AiFeedbackFormProps } from '../../types/types';
import FileUploadModal from '../Input/FileUploadModal';

const AiFeedbackForm: React.FC<AiFeedbackFormProps> = ({
  field,
  company,
  emphasisPoints,
  requirements,
  onFieldChange,
  onCompanyChange,
  onEmphasisChange,
  onRequirementChange,
  onResumeUpload, // 이 prop이 파일 업로드 로직과 연결되어야 함
  onGenerateFeedback
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // 파일 업로드 모달에서 파일 처리 (자소서 첨부 버튼 클릭 시)
  const handleFileUpload = (files: File[]) => {
    // setUploadedFiles(files); // 파일 목록 즉시 업데이트
    // 부모 컴포넌트로 파일 정보 전달 또는 상태 관리 로직
    console.log("Uploaded files in Form:", files);
    // 예시: onResumeUpload prop 사용 (타입 확인 필요)
    if (files.length > 0 && onResumeUpload) {
       // onResumeUpload(files[0]); // 단일 파일만 처리한다고 가정
       console.log("첫 번째 파일 정보를 onResumeUpload로 전달 (구현 필요)");
    }
  };

  // 파일 업로드 모달에서 '저장' 클릭 시
  const handleSaveFiles = (files: File[]) => {
    setUploadedFiles(files); // 최종 파일 목록 저장
    console.log("Saved files in Form:", files);
    // 여기서 onResumeUpload 호출 또는 다른 로직 수행 가능
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className={styles.formContainer}>
      <h2>AI 자소서 피드백</h2>

      <label htmlFor="resumeFile">자기소개서 파일 첨부</label>
      <Button onClick={() => setIsModalOpen(true)} className={styles.fileUploadButton}>
          자소서 파일 첨부
      </Button>
      {/* 업로드된 파일 목록 표시 (선택 사항) */}
      {uploadedFiles.length > 0 && (
        <ul className={styles.fileList}> {/* SCSS에 .fileList 스타일 필요 */}
          {uploadedFiles.map(file => <li key={file.name}>{file.name}</li>)}
        </ul>
      )}

      {/* 파일 업로드 모달 */}
      <FileUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileUpload={handleFileUpload} // 파일 선택/드롭 시 호출
        onSaveFiles={handleSaveFiles}   // 모달 내 저장 버튼 클릭 시 호출
      />

      {/* 나머지 폼 입력 요소들 */}
      <GuideInput label="지원하는 분야(선택)" value={field} onChange={onFieldChange} />
      <GuideInput label="지원하는 회사(선택)" value={company} onChange={onCompanyChange} />
      <GuideInput label="강조 포인트(선택)" value={emphasisPoints} onChange={onEmphasisChange} isTextArea />
      <GuideInput label="사용자 요구사항(선택)" value={requirements} onChange={onRequirementChange} isTextArea />

      {/* --- 피드백 요청 버튼 수정 --- */}
      <Button onClick={onGenerateFeedback} className={styles.submitButton}> {/* className 추가 */}
          피드백 요청
      </Button>
      {/* ------------------------- */}
    </div>
  );
};

export default AiFeedbackForm;