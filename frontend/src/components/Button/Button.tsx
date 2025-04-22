// src/components/Button/Button.tsx
import React, { MouseEventHandler, ReactNode } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
 onClick?: MouseEventHandler<HTMLButtonElement>;
 children?: ReactNode;
 primary?: boolean;
 className?: string; // className prop 추가
}

const Button: React.FC<ButtonProps> = ({ onClick, children, primary, className }) => {
 const buttonClasses = [styles.button];
 if (primary) {
 buttonClasses.push(styles.primary);
 }
 if (className) {
 buttonClasses.push(className); // 전달받은 className 추가
 }

 return (
 <button onClick={onClick} className={buttonClasses.join(' ')}>
 {children}
 </button>
 );
};

export default Button;