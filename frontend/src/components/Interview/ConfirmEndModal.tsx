import React, { FC } from 'react';
import styles from './ConfirmEndModal.module.scss'; // SCSS 모듈 import

interface ConfirmEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmEndModal: FC<ConfirmEndModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>면접 종료 확인</h2>
        <p>정말로 면접을 종료하시겠습니까?</p>
        <div className={styles.buttonGroup}>
          <button onClick={onConfirm} className={styles.confirmButton}>네</button>
          <button onClick={onClose} className={styles.cancelButton}>아니오</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEndModal;