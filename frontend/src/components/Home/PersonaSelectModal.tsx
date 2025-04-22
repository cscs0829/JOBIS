import React, { useState, useEffect } from 'react';
import styles from './PersonaSelectModal.module.scss';
import { PersonaSelectModalProps } from '../../types/types';

const PersonaSelectModal: React.FC<PersonaSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  personas,
  onInputChange,
  inputValue,
}) => {
  const [newPersonaName, setNewPersonaName] = useState(inputValue || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPersonaName(e.target.value);
    if (onInputChange) {
      onInputChange(e.target.value);
    }
  };

  const handleSaveClick = () => {
    if (newPersonaName.trim() !== '') {
      onSelect(newPersonaName);
      onClose();
    } else {
      alert('페르소나 이름을 입력하세요.');
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setNewPersonaName(inputValue || '');
    }
  }, [isOpen, inputValue]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.personaList}>
          {personas.map((persona) => (
            <div
              key={persona}
              className={styles.personaOption}
              onClick={() => onSelect(persona)}
            >
              <h3>{persona}</h3>
            </div>
          ))}
        </div>
        <input
          value={newPersonaName}
          onChange={handleInputChange}
          placeholder="원하는 페르소나를 입력하세요"
        />
        <div className={styles.buttonContainer}>
          <button onClick={handleSaveClick} disabled={newPersonaName.trim() === ''}>
            저장 하기
          </button>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelectModal;