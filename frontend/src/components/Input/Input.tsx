import React from 'react';
import styles from './Input.module.scss'; // 이 CSS 파일 생성

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className={styles.inputWrapper}>
      <label>{label}</label>
      <input {...props} className={styles.input} />
    </div>
  );
};

export default Input;