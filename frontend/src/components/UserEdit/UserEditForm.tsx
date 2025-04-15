import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import styles from './UserEditForm.module.scss';
import Input from '../Input/Input';
import FileInput from '../Input/FileInput';
import { UserEditFormData, UserEditFormProps } from '../../types/types';
import FileEditModal from './FileEditModal'; // FileEditModal 컴포넌트 임포트

const UserEditForm: React.FC<UserEditFormProps> = ({ selectedTab }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const [resumePreviewUrl, setResumePreviewUrl] = useState<string>('');
  const [portfolioPreviewUrl, setPortfolioPreviewUrl] = useState<string>('');
  const [coverLetterPreviewUrl, setCoverLetterPreviewUrl] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalPreviewUrl, setModalPreviewUrl] = useState<string>('');
  const [modalLabel, setModalLabel] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UserEditFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    desiredJobTitle: '',
    desiredJobCategory: '',
  });

  useEffect(() => {
    //TODO:  API로부터 사용자 정보 가져와서 formData에 설정 (예시)
    // fetch('/api/users/me')
    //   .then(response => response.json())
    //   .then(data => setFormData(data));
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null, setter: React.Dispatch<React.SetStateAction<File | null>>, setPreview: React.Dispatch<React.SetStateAction<string>>) => {
    setter(file);
    setPreview(file ? URL.createObjectURL(file) : '');
  };

  const openModal = (file: File | null, previewUrl: string, label: string, setFile: React.Dispatch<React.SetStateAction<File | null>>, setPreview: React.Dispatch<React.SetStateAction<string>>) => {
    setModalFile(file);
    setModalPreviewUrl(previewUrl);
    setModalLabel(label);
    setIsModalOpen(true);
    onModalFileChange = (newFile) => handleFileChange(newFile, setFile, setPreview);
  };

  let onModalFileChange: (file: File | null) => void = () => {};


  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, (formData as any)[key]);
      }
    }
    if (resumeFile) formDataToSend.append('resumeFile', resumeFile);
    if (portfolioFile) formDataToSend.append('portfolioFile', portfolioFile);
    if (coverLetterFile) formDataToSend.append('coverLetterFile', coverLetterFile);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('회원 정보가 성공적으로 수정되었습니다.');
      } else {
        alert('회원 정보 수정에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert('서버 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.formContainer}>
      {selectedTab === 0 ? (
        <>
          <h2>회원 정보 수정</h2>
          <Input label="이름" name="name" value={formData.name} onChange={handleInputChange} />
          <Input label="이메일" name="email" value={formData.email} onChange={handleInputChange} />
          <Input label="연락처" name="phone" value={formData.phone} onChange={handleInputChange} />
          <Input label="주소" name="address" value={formData.address} onChange={handleInputChange} />
          <Input label="희망 직종" name="desiredJobTitle" value={formData.desiredJobTitle} onChange={handleInputChange} />
          <Input label="희망 직업" name="desiredJobCategory" value={formData.desiredJobCategory} onChange={handleInputChange} />
        </>
      ) : (
        <>
          <h2>회원 파일 수정</h2>
          <div onClick={() => openModal(resumeFile, resumePreviewUrl, "이력서", setResumeFile, setResumePreviewUrl)}>
            <FileInput
              label="이력서 첨부"
              onChange={(file) => handleFileChange(file, setResumeFile, setResumePreviewUrl)}
            />
          </div>
          <div onClick={() => openModal(portfolioFile, portfolioPreviewUrl, "포트폴리오", setPortfolioFile, setPortfolioPreviewUrl)}>
            <FileInput
              label="포트폴리오 첨부"
              onChange={(file) => handleFileChange(file, setPortfolioFile, setPortfolioPreviewUrl)}
            />
          </div>
          <div onClick={() => openModal(coverLetterFile, coverLetterPreviewUrl, "자기소개서", setCoverLetterFile, setCoverLetterPreviewUrl)}>
             <FileInput
              label="자기소개서 첨부"
              onChange={(file) => handleFileChange(file, setCoverLetterFile, setCoverLetterPreviewUrl)}
            />
          </div>
        </>
      )}
      <button className={styles.submitButton} onClick={handleSubmit}>수정 완료</button>

      {isModalOpen && (
        <FileEditModal
          label={modalLabel}
          initialFile={modalFile}
          initialPreviewUrl={modalPreviewUrl}
          onFileChange={onModalFileChange}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default UserEditForm;