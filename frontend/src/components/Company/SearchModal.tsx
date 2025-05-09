// src/components/Company/SearchModal.tsx
import React, { FC, ReactNode } from 'react';
import styles from './SearchModal.module.scss'; // SCSS 파일 경로 수정
import { IoMdClose } from "react-icons/io";

interface SearchModalProps { // 인터페이스 이름 변경 (선택 사항이지만 권장)
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

// 컴포넌트 이름 변경: Modal -> SearchModal
const SearchModal: FC<SearchModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {title && <h2 className={styles.modalTitle}>{title}</h2>}
          <button className={styles.closeButton} onClick={onClose}>
             <IoMdClose />
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; // export 이름 변경