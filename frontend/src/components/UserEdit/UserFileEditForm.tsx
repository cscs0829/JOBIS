import React from 'react'; // useState 제거
import styles from './UserFileEditForm.module.scss';
// FileUploadModal, axios, FileUploadModalProps 등 제거

interface UserFileEditFormProps {
  openModal: (fileType: string) => void; // 파일 타입을 인자로 받도록 수정
  currentFiles: { [key: string]: File | null }; // 부모로부터 파일 상태 받기
  fileNames: { [key: string]: string }; // 파일명 전달 추가
}

const UserFileEditForm: React.FC<UserFileEditFormProps> = ({
  openModal, currentFiles, fileNames, }) => {
  // 내부 모달 상태, 파일 상태, 업로드 관련 함수 모두 제거

  // 파일 이름을 표시하는 함수
  const getFileName = (fileType: string): string => {
    const uploadedFile = currentFiles[fileType];
    const savedName = fileNames[fileType];
    return uploadedFile?.name || savedName || '';
  };

  return (
    <div className={styles.formContainer}>
      <h2>회원 파일 수정</h2>
      {/* 각 버튼 클릭 시 openModal 호출하며 파일 타입 전달 */}
      <button onClick={() => openModal('resume')}>
      {getFileName('resume') || '이력서 첨부'}
      </button>

      <button onClick={() => openModal('self_intro')}>
      {getFileName('self_intro') || '자기소개서 첨부'}
      </button>

      <button onClick={() => openModal('portfolio')}>
      {getFileName('portfolio') || '포트폴리오 첨부'}
      </button>



      {/* 내부 FileUploadModal 인스턴스들 제거 */}
    </div>
  );
};

export default UserFileEditForm;