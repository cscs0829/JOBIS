// src/components/AiFeedback/FeedbackTypeModal.tsx
import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import styles from './FeedbackTypeModal.module.scss'; // 경로 확인

// 피드백 옵션 정의 (동일)
const FEEDBACK_OPTIONS = [
  "문장 표현력 피드백",
  "구조 및 논리 흐름 피드백",
  "직무 적합성 피드백",
  "맞춤형 개선 예시 제안"
];

interface FeedbackTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedTypes: string[], otherType: string) => void;
  initialSelectedTypes?: string[];
  initialOtherType?: string;
}

const FeedbackTypeModal: React.FC<FeedbackTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSelectedTypes = [],
  initialOtherType = ''
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialSelectedTypes);
  const [otherType, setOtherType] = useState<string>(initialOtherType);

  useEffect(() => {
    if (isOpen) {
      setSelectedTypes(initialSelectedTypes);
      setOtherType(initialOtherType);
    }
  }, [isOpen, initialSelectedTypes, initialOtherType]);

  if (!isOpen) return null;

  // --- 카드 클릭 핸들러 ---
  const handleCardClick = (option: string) => {
    setSelectedTypes(prev =>
      prev.includes(option)
        ? prev.filter(type => type !== option) // 이미 있으면 제거 (토글)
        : [...prev, option] // 없으면 추가
    );
  };
  // --------------------

  const handleOtherInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherType(event.target.value);
  };

  const handleSaveClick = () => {
    onSave(selectedTypes, otherType);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>피드백 종류 선택 (중복 가능)</h2>
        <div className={styles.optionsContainer}>
          {FEEDBACK_OPTIONS.map(option => (
            // --- div에 onClick 핸들러 추가 및 selected 클래스 적용 ---
            <div
              key={option}
              className={`${styles.optionCard} ${selectedTypes.includes(option) ? styles.selected : ''}`} // selected 클래스 추가
              onClick={() => handleCardClick(option)} // div 클릭 시 핸들러 호출
            >
              {/* label과 input 제거하고 span만 남김 */}
              <span>{option}</span>
            </div>
            // ---------------------------------------------------
          ))}
        </div>

        <div className={styles.otherInputContainer}>
          <label htmlFor="otherFeedback">기타:</label>
          <input
            type="text"
            id="otherFeedback"
            value={otherType}
            onChange={handleOtherInputChange}
            placeholder="원하는 피드백을 직접 입력하세요"
          />
        </div>

        <div className={styles.buttonContainer}>
          <Button onClick={onClose} className={styles.cancelButton}>취소</Button>
          <Button onClick={handleSaveClick} className={styles.saveButton}>저장하기</Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTypeModal;