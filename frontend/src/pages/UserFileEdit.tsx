import React, { useState } from 'react';
import styles from './UserFileEdit.module.scss';
import UserEditNavbar from '../components/UserEdit/UserEditNavbar'; // Navbar 경로 확인 필요
import UserFileEditForm from '../components/UserEdit/UserFileEditForm';
import FileUploadModal from '../components/Input/FileUploadModal';
import axios from 'axios'; // axios import 추가

// UserEditNavbar props 타입 정의 (실제 Navbar 컴포넌트에 맞게 조정 필요)
interface UserEditNavbarProps {
  selectedTab: number;
  handleTabChange: (tabIndex: number) => void;
  navbarToggle: boolean;
  setNavbarToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

// 임시 Navbar 컴포넌트 (실제 컴포넌트로 대체 필요)
const DummyUserEditNavbar: React.FC<UserEditNavbarProps> = () => <div />;

const UserFileEdit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFileType, setEditingFileType] = useState<string | null>(null);
  // 파일 상태를 UserFileEdit에서 관리
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    resume: null,
    portfolio: null,
    intro: null,
  });

  // UserEditNavbar 관련 상태 (실제 Navbar 구현에 맞게 조정)
  const [selectedTab, setSelectedTab] = useState(0);
  const [navbarToggle, setNavbarToggle] = useState(false);

  // UserEditNavbar 탭 변경 핸들러 (실제 Navbar 구현에 맞게 조정)
  const handleTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };


  // 서버 업로드 로직 (UserFileEditForm에서 가져옴)
  const uploadFileToServer = async (file: File, file_type: string): Promise<boolean> => {
    console.log(
      `📤 uploadFileToServer() 호출됨: ${file.name}, type: ${file_type}`
    );

    const storedUserInfo = sessionStorage.getItem("userInfo");
    let mem_id: string | null = null;

    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        mem_id = parsedUserInfo?.id;
      } catch (error) {
        console.error("sessionStorage에서 userInfo 파싱 실패:", error);
      }
    }

    if (!mem_id) {
      alert("로그인이 필요합니다.");
      return false;
    }

    const formData = new FormData();
    formData.append("mem_id", mem_id);
    // 서버 API에 맞는 파일 타입 이름 사용 (예: self_intro)
    const serverFileType = file_type === 'intro' ? 'self_intro' : file_type;
    formData.append("file_type", serverFileType);
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:9000/upload", formData, { // API 주소 확인
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`📊 ${file_type} 업로드 진행률: ${percent}%`);
            // TODO: 업로드 진행률 UI 업데이트 로직 추가 가능
          }
        },
      });
      console.log(`✅ ${file_type} 업로드 성공`, res.data);
      return true;
    } catch (err) {
      console.log(`❌ ${file_type} 업로드 실패`, err);
       // 사용자 친화적인 파일 타입 이름으로 알림
       const userFriendlyFileType = file_type === 'resume' ? '이력서' : file_type === 'portfolio' ? '포트폴리오' : '자기소개서';
       alert(`${userFriendlyFileType} 업로드에 실패했습니다.`);
      return false;
    }
  };

  // 모달 열기 함수 (파일 타입 받도록 수정)
  const openModal = (fileType: string) => {
    setEditingFileType(fileType); // 어떤 파일을 편집 중인지 상태 설정
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFileType(null); // 모달 닫을 때 편집 중 파일 타입 초기화
  };

  // 파일 업로드 핸들러 (Modal에서 호출) - 파일 상태 업데이트
  const handleFileUpload = (uploadedFiles: File[]) => {
    if (editingFileType && uploadedFiles.length > 0) {
      console.log(`${editingFileType} 파일 선택됨:`, uploadedFiles[0]);
      // 실제 저장은 handleSaveFiles에서 진행하므로 여기서는 상태 업데이트 불필요 (필요 시 추가)
    }
  };

  // 파일 저장 핸들러 (Modal에서 호출) - 서버 업로드 및 상태 업데이트
  const handleSaveFiles = async (filesToSave: File[]) => {
    console.log('💾 handleSaveFiles 호출됨', filesToSave);
    if (editingFileType && filesToSave.length > 0) {
      const file = filesToSave[0];
      console.log(`📤 ${editingFileType} 업로드 시도:`, file.name);
      const isUploadSuccess = await uploadFileToServer(file, editingFileType);

      if (isUploadSuccess) {
         // 사용자 친화적인 파일 타입 이름으로 알림
         const userFriendlyFileType = editingFileType === 'resume' ? '이력서' : editingFileType === 'portfolio' ? '포트폴리오' : '자기소개서';
         alert(`${userFriendlyFileType} 업로드 완료!`);
        // 업로드 성공 시 파일 상태 업데이트
        setFiles(prevFiles => ({
          ...prevFiles,
          [editingFileType]: file,
        }));
        closeModal(); // 성공 시 모달 닫기
      } else {
        // 업로드 실패 시에도 모달은 닫도록 closeModal() 호출 (필요에 따라 유지 또는 제거)
         closeModal(); // 실패 시 모달 닫기 (UX 고려)
      }
    } else {
       console.log("저장할 파일 또는 파일 타입 없음");
       closeModal(); // 파일 없어도 모달 닫기
    }
  };

  return (
    <div className={styles.userEdit}>
      <div className={styles.userEditContainer}>
        <div className={styles.userEditLeft}>
        <UserEditNavbar />
           <DummyUserEditNavbar
             selectedTab={selectedTab}
             handleTabChange={handleTabChange}
             navbarToggle={navbarToggle}
             setNavbarToggle={setNavbarToggle}
           />
        </div>
        <div className={styles.userEditRight}>
          {/* openModal 함수와 파일 상태 전달 */}
          <UserFileEditForm
            openModal={openModal}
            currentFiles={files} // 현재 파일 상태 전달
          />
        </div>
      </div>
      {/* 단일 FileUploadModal 인스턴스 */}
      <FileUploadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onFileUpload={handleFileUpload} // 파일 선택 시 호출될 함수
        onSaveFiles={handleSaveFiles}   // 저장 버튼 클릭 시 호출될 함수
      />
    </div>
  );
};

export default UserFileEdit;