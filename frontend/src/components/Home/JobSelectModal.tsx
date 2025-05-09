import React, { useState, useEffect, useRef } from "react";
 import styles from "./JobSelectModal.module.scss";
 import { JobSelectModalProps } from "../../types/types";

 const JobSelectModal: React.FC<JobSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  jobs,
  onInputChange,
  inputValue,
 }) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue || "");
  const [isInputDirty, setIsInputDirty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  setLocalInputValue(inputValue || ""); // inputValue 변경 시 localInputValue 만 업데이트
  if (inputRef.current) {
  inputRef.current.focus();
  }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setLocalInputValue(value);
  setIsInputDirty(value !== inputValue);
  if (onInputChange) {
  onInputChange(value);
  }
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();
  if (localInputValue.trim() !== "") {
  onSelect(localInputValue);
  onClose();
  } else {
  alert("직무를 입력해주세요.");
  if (inputRef.current) {
  inputRef.current.focus();
  }
  }
  };

  const handleModalOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (e.target === e.currentTarget && !isInputDirty) {
  onClose();
  }
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
  <div className={styles.modalOverlay} onClick={handleModalOverlayClick}>
  <div className={styles.modalContent} onClick={handleModalContentClick}>
  <h2>직무 선택</h2>
  <div className={styles.jobList}>
  {jobs.map((job, index) => (
  <div
  key={index}
  className={styles.jobOption}
  onClick={() => {
  onSelect(job);
  onClose();
  }}
  >
  {job}
  </div>
  ))}
  <input
  type="text"
  value={localInputValue}
  onChange={handleInputChange}
  placeholder="원하는 직무를 입력하세요"
  ref={inputRef}
  />
  </div>
  <div className={styles.buttonContainer}>
  <button onClick={handleSaveClick} disabled={!isInputDirty}>
  저장 하기
  </button>
  <button
  onClick={(e) => {
  e.stopPropagation();
  onClose();
  }}
  disabled={isInputDirty}
  >
  닫기
  </button>
  </div>
  </div>
  </div>
  );
 };

 export default JobSelectModal;