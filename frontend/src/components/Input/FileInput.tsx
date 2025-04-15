import React, { FC, ChangeEvent } from 'react';
import styles from './FileInput.module.scss';

interface FileInputProps {
  label: string;
  onChange: (file: File | null) => void;
}

const FileInput: FC<FileInputProps> = ({ label, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onChange(file);
  };

  return (
    <div className={styles.fileInputWrapper}>
      <label htmlFor="fileInput">{label}</label>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
};

export default FileInput;