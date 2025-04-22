import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "./FileUploadModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFilePdf,
  faFileWord,
  faFilePowerpoint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (files: File[]) => void;
  onSaveFiles: (files: File[]) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  speed: number;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
  onSaveFiles,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const MAX_FILE_COUNT = 5;

  const getFileIcon = (filename: string | undefined) => {
    const ext = filename?.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
      case "pdf":
        return faFilePdf;
      case "ppt":
      case "pptx":
        return faFilePowerpoint;
      case "doc":
      case "docx":
        return faFileWord;
      default:
        return faFile;
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFilesChange(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFilesChange(selectedFiles as File[]);
  };

  const handleFilesChange = useCallback(
    (newFiles: File[]) => {
      const validatedFiles: UploadingFile[] = [];
      const newErrors: string[] = [];

      if (selectedFiles.length + newFiles.length > MAX_FILE_COUNT) {
        newErrors.push(`You can upload a maximum of ${MAX_FILE_COUNT} files.`);
      }

      for (const file of newFiles) {
        if (file.size > MAX_FILE_SIZE) {
          newErrors.push(`${file.name} is too large.`);
        } else if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
          newErrors.push(`${file.name} has an unsupported file type.`);
        } else {
          validatedFiles.push({ file, progress: 0, speed: 0 });
        }
      }

      if (newErrors.length > 0) {
        setErrors((prevErrors) => [...prevErrors, ...newErrors]);
        return;
      }

      setSelectedFiles((prev) => [...prev, ...validatedFiles]);
    },
    [selectedFiles]
  );

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSaveClick = () => {
    console.log("📌 Save 버튼 클릭됨");

    if (selectedFiles.length === 0) {
      setErrors(["Please upload at least one file."]);
      console.log("❌ 저장 실패: 선택된 파일 없음");
      return;
    }

    console.log("✅ 저장 진행: onSaveFiles 호출 시도", selectedFiles);

    setIsUploading(true);
    // TODO: 실제 파일 업로드 로직 구현
    // uploadFiles(selectedFiles, onProgressCallback)

    // 가짜 업로드 시뮬레이션
    const speeds = selectedFiles.map(() =>
      Math.floor(Math.random() * 100 + 50)
    );

    selectedFiles.forEach((item, index) => {
      const totalSize = item.file.size;
      const speed = speeds[index] * 1024;
      let uploaded = 0;

      const interval = setInterval(() => {
        uploaded += speed;
        const progress = Math.min(
          100,
          Math.round((uploaded / Math.max(totalSize, 1)) * 100)
        );

        setSelectedFiles((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], progress, speed };
          return updated;
        });

        if (progress >= 100) {
          clearInterval(interval);
          if (index === selectedFiles.length - 1) {
            setTimeout(() => {
              setIsUploading(false);
              const files = selectedFiles.map((f) => f.file);
              console.log("📤 최종 onSaveFiles에 넘길 파일 목록:", files);
              onSaveFiles(files);
              onClose();
            }, 500);
          }
        }
      }, 100);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>파일 업로드</h2>
        <div className={styles.modalBody}>
          <div className={styles.fileUploadSectionContainer}>
            <div
              className={`${styles.fileUploadSection} ${
                isDragging ? styles.dragActive : styles.dragInactive
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleButtonClick}
            >
              <FontAwesomeIcon icon={faFile} size="4x" color="#888" />
              <p>Drag files to upload</p>
            </div>
            <div className={styles.fileListSection}>
              {selectedFiles.length > 0 ? (
                <div className={styles.fileInfoSection}>
                  {selectedFiles.map((item, idx) => (
                    <div key={idx} className={styles.fileItem}>
                      <div className={styles.fileItemDetails}>
                        <FontAwesomeIcon icon={getFileIcon(item.file.name)} />
                        <div className={styles.fileName}>{item.file.name}</div>
                        <div className={styles.fileProgress}>
                          {item.progress}% done
                        </div>
                        {isUploading && (
                          <div className={styles.fileSpeed}>
                            {item.speed.toFixed(0)} KB/sec
                          </div>
                        )}
                      </div>
                      <div className={styles.fileSize}>
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={styles.removeFileIcon}
                        onClick={() => handleRemoveFile(idx)}
                      />
                      {isUploading && (
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressBarFill}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No files selected</p>
              )}
            </div>
          </div>
          {errors.length > 0 && (
            <div className={styles.errorContainer}>
              {errors.map((err, i) => (
                <p key={i} className={styles.errorText}>
                  {err}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button
            onClick={handleSaveClick}
            disabled={isUploading}
            className={styles.saveButton}
          >
            {isUploading ? "Uploading..." : "Save"}
          </button>
          <button
            onClick={onClose}
            disabled={isUploading}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
        multiple
      />
    </div>
  );
};

export default FileUploadModal;
