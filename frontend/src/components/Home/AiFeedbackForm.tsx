import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuideInput from '../Input/GuideInput';
import Button from '../Button/Button';
import styles from './AiFeedbackForm.module.scss';
import { AiFeedbackFormProps } from '../../types/types';
import { FaInfoCircle } from 'react-icons/fa';

const AiFeedbackForm: React.FC<AiFeedbackFormProps> = ({
  field,
  onFieldChange,
  selectedFeedbackTypes,
  otherFeedbackType,
  onOpenFeedbackModal,
  onGenerateFeedback,
}) => {
  const navigate = useNavigate();
  const fileEditTooltipText = "이력서, 자기소개서, 포트폴리오 파일은\n'첨부 파일 수정' 버튼을 눌러 관리할 수 있습니다.";

  const handleEditFileClick = () => {
    navigate('/user-file-edit');
  };

  const displaySelectedFeedback = () => {
    let displayString = selectedFeedbackTypes.join(', ');
    if (otherFeedbackType) {
      displayString += (displayString ? ', ' : '') + otherFeedbackType;
    }
    return displayString || '선택된 피드백 없음';
  };

  return (
    <div className={styles.formContainer}>
      <h2>AI 자소서 피드백</h2>

      {/* 파일 수정 이동 버튼 */}
      <div className={styles.attachedFileSection}>
        <div className={styles.fileEditLabelContainer}>
          <label>첨부 파일 수정</label>
          <span className={styles.tooltipIcon} title={fileEditTooltipText}>
            <FaInfoCircle />
          </span>
        </div>
        <Button onClick={handleEditFileClick} className={styles.fileUploadButton}>
          첨부 파일 수정하러 가기
        </Button>
      </div>

      {/* 지원 직무 입력 */}
      <GuideInput label="지원할 직무 (선택)" value={field} onChange={onFieldChange} />

      {/* 피드백 종류 선택 */}
      <label>피드백 선택</label>
      <Button onClick={onOpenFeedbackModal} className={styles.feedbackSelectButton}>
        피드백 종류 선택
      </Button>

      {/* 선택된 피드백 표시 */}
      <div className={styles.selectedFeedbackDisplay}>
        {displaySelectedFeedback()}
      </div>

      {/* 피드백 요청 버튼 */}
      <Button onClick={onGenerateFeedback} className={styles.submitButton}>
        피드백 요청
      </Button>
    </div>
  );
};

export default AiFeedbackForm;
