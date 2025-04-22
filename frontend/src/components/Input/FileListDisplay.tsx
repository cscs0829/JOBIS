import React from "react";
 import styles from "./FileListDisplay.module.scss";

 interface FileListDisplayProps {
  files: File[];
  onFileRemove: (index: number) => void;
 }

 const FileListDisplay: React.FC<FileListDisplayProps> = ({ files, onFileRemove }) => {
  return (
  <div className={styles.FileListDisplay}>
  {files.map((file, index) => (
  <div key={index} className={styles.FileListDisplay__file}>
  <span>{file.name}</span>
  <span
  className={styles.FileListDisplay__remove}
  onClick={() => onFileRemove(index)}
  >
  x
  </span>
  </div>
  ))}
  </div>
  );
 };

 export default FileListDisplay;