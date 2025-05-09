import React from 'react';
import styles from './UserFileEditForm.module.scss';
// react-icons 라이브러리가 설치되어 있다고 가정합니다. 없다면 설치해주세요.
// npm install react-icons
import { FaUpload, FaTrashAlt } from 'react-icons/fa'; // 아이콘 추가

interface UserFileEditFormProps {
  openModal: (fileType: string) => void;
  currentFiles: { [key: string]: File | null };
  fileNames: { [key: string]: string };
  onDeleteFile: (fileType: string) => void;
}

const UserFileEditForm: React.FC<UserFileEditFormProps> = ({
  openModal, currentFiles, fileNames, onDeleteFile,
}) => {

  // 파일 타입에 따른 한글 레이블 반환 함수
  const getFileTypeLabel = (type: string): string => {
    switch (type) {
      case 'resume': return '이력서';
      case 'self_intro': return '자기소개서';
      case 'portfolio': return '포트폴리오';
      default: return '';
    }
  };

  // 현재 표시될 파일 이름 가져오기 (업로드된 파일 우선, 없으면 저장된 이름)
  const getCurrentFileName = (fileType: string): string => {
    return currentFiles[fileType]?.name || fileNames[fileType] || '';
  };

  return (
    <div className={styles.formContainer}>
      <h2>회원 파일 수정</h2>
      <p className={styles.description}>
        이력서, 자기소개서, 포트폴리오 파일을 관리하세요.
      </p> {/* 설명 추가 */}

      {['resume', 'self_intro', 'portfolio'].map((type) => {
        const currentFileName = getCurrentFileName(type);
        const label = getFileTypeLabel(type);

        return (
          <div key={type} className={styles.fileInputGroup}> {/* 변경: fileRow -> fileInputGroup */}
            <span className={styles.fileLabel}>{label}</span> {/* 레이블 추가 */}
            <div className={styles.fileInfo}>
              {currentFileName ? (
                <span className={styles.fileName}>{currentFileName}</span>
              ) : (
                <span className={styles.noFile}>첨부된 파일이 없습니다.</span> // 파일 없을 때 메시지
              )}
            </div>
            <div className={styles.buttonGroup}> {/* 버튼 그룹 */}
              <button
                type="button" // submit 방지
                className={`${styles.actionButton} ${styles.uploadButton}`} // 클래스 추가
                onClick={() => openModal(type)}
                aria-label={`${label} ${currentFileName ? '변경' : '첨부'}`} // 접근성 위한 레이블
              >
                <FaUpload /> {/* 업로드 아이콘 */}
                <span>{currentFileName ? '파일 변경' : '파일 첨부'}</span>
              </button>
              {currentFileName && ( // 파일이 있을 때만 삭제 버튼 표시
                <button
                  type="button" // submit 방지
                  className={`${styles.actionButton} ${styles.deleteButton}`} // 클래스 추가
                  onClick={() => onDeleteFile(type)}
                  aria-label={`${label} 파일 삭제`} // 접근성 위한 레이블
                >
                  <FaTrashAlt /> {/* 삭제 아이콘 */}
                  <span>삭제</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserFileEditForm;