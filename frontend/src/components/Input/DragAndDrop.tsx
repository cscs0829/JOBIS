import React, { useState, useCallback, useRef } from "react";
 import DragAndDropInput from "./DragAndDropInput";
 import FileListDisplay from "./FileListDisplay";
 import { DragAndDropProps } from "../../types/types";
 import styles from "./DragAndDrop.module.scss";
 import Button from "../Button/Button";
 import FileInput from "./FileInput";
 
 interface Props extends DragAndDropProps {
  onSave: (files: File[]) => void;
 }
 
 const DragAndDrop: React.FC<Props> = ({ label, onFileUpload, onSave }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [key, setKey] = useState(Date.now());
  const dropAreaRef = useRef<HTMLDivElement>(null);
 
  const handleFilesChange = useCallback(
  (newFiles: File[]) => {
  setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  },
  []
  );
 
  const handleFileRemove = useCallback((index: number) => {
  setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);
 
  const triggerFileInput = () => {
  setKey(Date.now());
  };
 
  const handleSaveFiles = () => {
  onSave(files);
  setFiles([]);
  };
 
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFiles = Array.from(e.target.files || []);
  handleFilesChange(selectedFiles as File[]);
  };
 
  return (
  <div className={styles.DragAndDropContainer}>
  <h2 className={styles.title}>Validate & Upload Files with React</h2>
  <div className={styles.contentArea}>
  <div className={styles.uploadArea} ref={dropAreaRef}>
  <DragAndDropInput
  key={key}
  onFilesChange={handleFilesChange}
  isDragging={isDragging}
  setIsDragging={setIsDragging}
  onClick={triggerFileInput}
  />
  <FileInput label="or Upload Files" id="fileInput" onChange={handleFileInputChange} />
  </div>
  <div className={styles.fileListArea}>
  {files.length > 0 ? (
  <FileListDisplay files={files} onFileRemove={handleFileRemove} />
  ) : (
  <p className={styles.noFilesText}>No Files Uploaded Yet</p>
  )}
  </div>
  </div>
  <Button onClick={handleSaveFiles} primary className={styles.saveButton}>
  Save
  </Button>
  </div>
  );
 };
 
 export default DragAndDrop;