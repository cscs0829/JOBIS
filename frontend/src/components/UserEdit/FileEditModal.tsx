import React, { useState, ChangeEvent, useCallback, useRef } from 'react';
import styles from './FileEditModal.module.scss';
import Button from '../Button/Button';

interface FileEditModalProps {
    label: string;
    initialFile: File | null;
    initialPreviewUrl: string;
    onFileChange: (file: File | null) => void;
    onClose: () => void;
}

const FileEditModal: React.FC<FileEditModalProps> = ({
    label,
    initialFile,
    initialPreviewUrl,
    onFileChange,
    onClose,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDrop = useCallback((files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            // 드래그 드롭으로 파일 선택 시 input 요소에도 파일 설정
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
            }
        }
    }, []);

    const handleDragEnter = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 이벤트 전파 방지
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUpdate = () => {
        onFileChange(selectedFile);
        onClose();
    };

    const handleDelete = () => {
        onFileChange(null);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{label} 수정</h2>
                <div className={styles.modalBody}>
                    <div
                        className={styles.fileUploadSection}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.dataTransfer.files) {
                                handleDrop(e.dataTransfer.files);
                                // 드롭 이벤트 발생 후 input 요소의 onChange 이벤트 트리거
                                if (fileInputRef.current) {
                                    fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            }
                            setDragActive(false);
                        }}
                        onClick={handleButtonClick} // 클릭 시 파일 선택 창 열기
                    >
                        {dragActive ? (
                            <div className={styles.dragActive}>
                                파일을 여기에 놓으세요!
                            </div>
                        ) : (
                            <div className={styles.dragInactive}>
                                <p>파일을 드래그하거나</p>
                                <p>버튼을 클릭하세요.</p>
                            </div>
                        )}
                    </div>
                    <div className={styles.fileInfoSection}>
                        {initialFile ? (
                            <div>
                                <p>기존 파일: {initialFile.name}</p>
                                <p>형식: {initialFile.type}</p>
                                <Button onClick={handleDelete}>삭제</Button>
                            </div>
                        ) : (
                            <p>선택된 파일 없음</p>
                        )}
                        {selectedFile && (
                            <div>
                                <p>새 파일: {selectedFile.name}</p>
                                <p>형식: {selectedFile.type}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <Button onClick={handleUpdate}>저장</Button>
                    <Button onClick={onClose}>취소</Button>
                </div>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // 숨김 처리 유지
                    ref={fileInputRef}
                />
            </div>
        </div>
    );
};

export default FileEditModal;