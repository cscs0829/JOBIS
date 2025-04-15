import React from 'react';
import styles from './Button.module.scss'; // 이 CSS 파일 생성

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={styles.button}>{children}</button>
  );
};

export default Button;