// src/components/Home/PersonaSelectModal.tsx
import React from "react";
import styles from "./PersonaSelectModal.module.scss"; // 스타일 파일 임포트
import { PersonaSelectModalProps } from "../../types/types"; // 타입 임포트

// --- Persona 데이터 타입 변경 ---
// 기존: personas: string[]
// 변경: personas: { name: string; image: string }[]
interface UpdatedPersonaSelectModalProps extends Omit<PersonaSelectModalProps, 'personas'> {
  personas: { name: string; image: string }[];
}
// ----------------------------

const PersonaSelectModal: React.FC<UpdatedPersonaSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect, // 이제 string (persona.name)을 받습니다.
  personas,
  onInputChange, // 필요 시 사용
  inputValue,    // 필요 시 사용
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>면접관 페르소나 선택</h2>
        {/* 페르소나 목록 렌더링 */}
        <div className={styles.personaList}>
          {personas.map((persona) => (
            // --- persona 객체 사용 및 이미지 추가 ---
            <div
              key={persona.name}
              className={styles.personaOption}
              // 클릭 시 persona.name을 전달하도록 수정 (기존 persona 객체 -> persona.name)
              onClick={() => onSelect(persona.name)}
            >
              {/* 이미지 태그 추가 (이미지 경로가 있을 경우에만 렌더링) */}
              {persona.image && (
                <img src={persona.image} alt={persona.name} className={styles.personaImage} />
              )}
              {/* 페르소나 이름 */}
              <h3>{persona.name}</h3>
              {/* 필요하다면 페르소나 설명 (현재는 없음) */}
              {/* <p>{persona.description}</p> */}
            </div>
            // ------------------------------------
          ))}
        </div>

        {/* 입력 필드 (직접 입력 기능이 있다면 유지) */}
        {onInputChange && (
          <input
            type="text"
            placeholder="직접 입력"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
          />
        )}

        {/* 버튼 컨테이너 */}
        <div className={styles.buttonContainer}>
            {/* 직접 입력 값이 있을 때만 확인 버튼 활성화 (선택 사항) */}
          {/* <button onClick={() => inputValue && onSelect(inputValue)} disabled={!inputValue}>
             확인
           </button> */}
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelectModal;