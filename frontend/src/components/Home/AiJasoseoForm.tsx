import React, { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { FormData } from '../../types/types'; // FormData 타입 정의에 맞게 Omit 사용
import styles from './AiJasoseoForm.module.scss';
import { FaChevronRight, FaInfoCircle } from 'react-icons/fa'; // react-icons에서 아이콘 임포트

interface AiJasoseoFormProps {
  formData: FormData;
  // ✅ 필요한 필드만 남기고, 파일 관련 필드는 Omit으로 제외
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof Omit<FormData, 'cvFile' | 'resumeFile' | 'portfolioFile' | 'qualifications' | 'projects' | 'experiences' | 'major'>) => void;
  onGenerate: () => void;
}

const AiJasoseoForm: React.FC<AiJasoseoFormProps> = ({
  formData,
  onChange,
  onGenerate,
}) => {
  const fileEditTooltipText = "이력서, 자기소개서, 포트폴리오 파일은\n'첨부 파일 수정' 버튼을 눌러 관리할 수 있습니다.";

  const navigate = useNavigate();

  const handleEditFileClick = () => {
    navigate('/user-file-edit');
  };

  return (
    <div className={styles.formContainer}>
      <h2>AI 자소서 작성</h2>

      {/* 파일 첨부 섹션 */}
      <div className={styles.attachedFileSection}>
        <div className={styles.fileEditLabelContainer}>
          <label>첨부 파일 수정</label>
          <span className={styles.tooltipIcon} title={fileEditTooltipText}>
            <FaInfoCircle />
          </span>
        </div>
        <Button onClick={handleEditFileClick} className={styles.fileUploadButton}>
          <div className={styles.buttonContent}>
            <span className={styles.buttonTitle}>첨부 파일 수정하기</span>
            <span className={styles.buttonDescription}>이력서, 자기소개서, 포트폴리오를 관리해보세요</span>
          </div>
          <div className={styles.buttonIcon}>
            <FaChevronRight />
          </div>
        </Button>
      </div>

      {/* --- 필수 Input 필드들 --- */}
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
        isTextArea={true}
      />

      {/* 👇 타입 오류 방지를 위해 Button 컴포넌트의 onClick 타입 확인 또는 수정 필요 */}
      <Button onClick={onGenerate} className={styles.submitButton}>자소서 작성</Button>
    </div>
  );
};

export default AiJasoseoForm;