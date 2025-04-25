import React, { useState } from 'react';
import styles from './UserFileEdit.module.scss';
import UserEditNavbar from '../components/UserEdit/UserEditNavbar'; // Navbar 경로 확인 필요
import UserFileEditForm from '../components/UserEdit/UserFileEditForm';
import FileUploadModal from '../components/Input/FileUploadModal';
import axios from 'axios'; // axios import 추가
import { useEffect } from 'react';


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
    self_intro: null,
  });
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({
    resume: '',
    portfolio: '',
    self_intro: '',
  });
  // ✅ 파일명 유지용 상태 (FileUploadModal용)
  const [initialFiles, setInitialFiles] = useState<
    { file: File; progress: number; speed: number }[]
  >([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("uploadedFileNames");
    if (stored) {
      const parsed = JSON.parse(stored);
      setFileNames(prev => ({ ...prev, ...parsed }));
    }
    const storedUserInfo = sessionStorage.getItem("userInfo");
    if (!storedUserInfo) return;
    const mem_id = JSON.parse(storedUserInfo).id;
    if (!mem_id) return;
  
    axios.get(`http://localhost:9000/uploaded-files`, {
      params: { mem_id },
    }).then((res) => {
      console.log("📂 기존 업로드된 파일:", res.data);
      setFileNames(res.data);
    }).catch((err) => {
      console.error("❌ 파일 목록 불러오기 실패", err);
    });
  }, []);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("userInfo");
    if (!storedUserInfo) return;
    const mem_id = JSON.parse(storedUserInfo).id;
    if (!mem_id) return;
  
    axios.get(`http://localhost:9000/uploaded-files`, {
      params: { mem_id },
    }).then((res) => {
      console.log("📂 기존 업로드된 파일:", res.data);
  
      // ✅ sessionStorage에 저장
      sessionStorage.setItem("uploadedFileNames", JSON.stringify(res.data));
  
      // ✅ 상태에도 반영
      setFileNames(res.data);
    }).catch((err) => {
      console.error("❌ 파일 목록 불러오기 실패", err);
    });
  }, []);

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
    if (!["resume", "self_intro", "portfolio"].includes(file_type)) {
      console.error("❌ 잘못된 file_type 전달됨:", file_type);
      return false;
    }
    const formData = new FormData();
    formData.append("mem_id", mem_id);
    formData.append("file_type", file_type); // ✅ 그대로 전달
    formData.append("file", file, file.name); // 파일 이름도 명시!

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
  
  // 파일 저장 핸들러 (Modal에서 호출) - 서버 업로드 및 상태 업데이트
  const handleSaveFiles = async (filesToSave: File[]) => {
    if (editingFileType && filesToSave.length > 0) {
      const file = filesToSave[0];
      if (!file) {
        alert("파일이 없습니다.");
        return;
      }
      const isUploadSuccess = await uploadFileToServer(file, editingFileType);
      if (isUploadSuccess) {
        setFiles(prev => ({ ...prev, [editingFileType]: file }));
        setFileNames(prev => ({ ...prev, [editingFileType]: file.name })); // ✅ 반영됨
        // ✅ sessionStorage에 파일명 저장
        const stored = sessionStorage.getItem("uploadedFileNames") || "{}";
        const updated = JSON.parse(stored);
        updated[editingFileType] = file.name;
        sessionStorage.setItem("uploadedFileNames", JSON.stringify(updated));
        alert(`${editingFileType === 'resume' ? '이력서' : editingFileType === 'portfolio' ? '포트폴리오' : '자기소개서'} 업로드 완료!`);
        closeModal();
      } else {
        closeModal();
      }
    } else {
      closeModal();
    }
  };
  
  // 파일 업로드 핸들러 (Modal에서 호출) - 파일 상태 업데이트
  const handleFileUpload = (uploadedFiles: File[]) => {
    if (editingFileType && uploadedFiles.length > 0) {
      const file = uploadedFiles[0];
      console.log(`${editingFileType} 파일 선택됨:`, file);
  
      // ✅ 새로 선택한 파일을 모달에 즉시 반영
      setInitialFiles([{ file, progress: 0, speed: 0 }]);
    }
  };
  
  // 모달 열기 함수 (파일 타입 받도록 수정)
  const openModal = (fileType: string) => {
    setEditingFileType(fileType); // 어떤 파일을 편집 중인지 상태 설정
    setIsModalOpen(true);
    // ✅ sessionStorage에서 해당 파일명이 있으면 보여줄 초기값 설정
    const stored = sessionStorage.getItem("uploadedFileNames");
    if (stored) {
      const parsed = JSON.parse(stored);
      const name = parsed[fileType];
      if (name) {
        setInitialFiles([{ file: new File([], name), progress: 100, speed: 0 }]);
      } else {
        setInitialFiles([]);
      }
    } else {
      setInitialFiles([]);
    }
  };
  
  const handleDeleteFile = async (fileType: string) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const storedUserInfo = sessionStorage.getItem("userInfo");
    const mem_id = storedUserInfo ? JSON.parse(storedUserInfo).id : null;
    if (!mem_id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("mem_id", mem_id);
      formData.append("file_type", fileType);

      await axios.post("http://localhost:9000/delete-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFiles((prev) => ({ ...prev, [fileType]: null }));
      setFileNames((prev) => ({ ...prev, [fileType]: "" }));

      const stored = sessionStorage.getItem("uploadedFileNames") || "{}";
      const updated = JSON.parse(stored);
      delete updated[fileType];
      sessionStorage.setItem("uploadedFileNames", JSON.stringify(updated));

      alert("파일이 삭제되었습니다.");
    } catch (err) {
      console.error("❌ 파일 삭제 실패", err);
      alert("파일 삭제에 실패했습니다.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFileType(null); // 모달 닫을 때 편집 중 파일 타입 초기화
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
            fileNames={fileNames} // ✅ 추가
            onDeleteFile={handleDeleteFile} // ✅ 추가된 삭제 함수 전달

          />
        </div>
      </div>
      {/* 단일 FileUploadModal 인스턴스 */}
      <FileUploadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onFileUpload={handleFileUpload} // 파일 선택 시 호출될 함수
        onSaveFiles={handleSaveFiles}   // 저장 버튼 클릭 시 호출될 함수
        initialFiles={initialFiles} // ✅ 이 줄 꼭 있어야 함!!
      />
    </div>
  );
};

export default UserFileEdit;