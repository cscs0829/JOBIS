import React from "react";
 import styles from "./FileInput.module.scss";

 interface FileInputProps {
  label: string;
  id: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
 }

 const FileInput: React.FC<FileInputProps> = ({ label, id, onChange }) => {
  return (
  <div className={styles.fileInputWrapper}>
  <label htmlFor={id}>{label}</label>
  <input type="file" id={id} onChange={onChange} multiple />
  </div>
  );
 };

 export default FileInput;