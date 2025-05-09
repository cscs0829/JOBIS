import React, { MouseEventHandler, ReactNode } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  primary?: boolean;
  className?: string;
  disabled?: boolean; // ✅ 여기도 props 선언 추가
}

const Button: React.FC<ButtonProps> = ({ onClick, children, primary, className, disabled }) => {
  const buttonClasses = [styles.button];
  if (primary) {
    buttonClasses.push(styles.primary);
  }
  if (className) {
    buttonClasses.push(className);
  }

  return (
    <button
      onClick={onClick}
      className={buttonClasses.join(' ')}
      disabled={disabled} // ✅ 여기 꼭 반영!
    >
      {children}
    </button>
  );
};

export default Button;
