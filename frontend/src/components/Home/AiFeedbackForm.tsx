import React, { useState } from 'react';
import GuideInput from '../Input/GuideInput';
import GuideFileInput from '../Input/GuideFileInput';
import Button from '../Button/Button';
import styles from './AiFeedbackForm.module.scss';
import { AiFeedbackFormProps } from '../../types/types';
import FileUploadModal from '../Input/FileUploadModal'; // FileUploadModal import

const AiFeedbackForm: React.FC<AiFeedbackFormProps> = ({
    field,
    company,
    emphasisPoints,
    requirements,
    onFieldChange,
    onCompanyChange,
    onEmphasisChange,
    onRequirementChange,
    onResumeUpload,
    onGenerateFeedback
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleFileUpload = (files: File[]) => {
        setUploadedFiles(files);
        // 파일 처리 로직 (예: 부모 컴포넌트로 전달)
        console.log("Uploaded files in Form:", files);
    };

    const handleSaveFiles = (files: File[]) => {
        setUploadedFiles(files);
        console.log("Saved files in Form:", files);
        setIsModalOpen(false); // 모달 닫기
    };

    return (
        <div className={styles.formContainer}>
            <h2>AI 자소서 피드백</h2>
            <Button onClick={() => setIsModalOpen(true)}>자소서 첨부</Button>
            <FileUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onFileUpload={handleFileUpload}
                onSaveFiles={handleSaveFiles}
            />
            {/* ... 나머지 폼 입력 요소들 */}
            <GuideInput label="지원하는 분야(선택)" value={field} onChange={onFieldChange} />
            <GuideInput label="지원하는 회사(선택)" value={company} onChange={onCompanyChange} />
            <GuideInput label="강조 포인트(선택)" value={emphasisPoints} onChange={onEmphasisChange} isTextArea />
            <GuideInput label="사용자 요구사항(선택)" value={requirements} onChange={onRequirementChange} isTextArea />
            <Button onClick={onGenerateFeedback}>피드백 요청</Button>
        </div>
    );
};

export default AiFeedbackForm;