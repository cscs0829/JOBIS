import React, { ChangeEvent, ChangeEventHandler } from 'react';
import styles from './GuideInput.module.scss'; // Updated import

interface GuideInputProps { // Updated interface name
    label: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    isTextArea?: boolean;
}

const GuideInput: React.FC<GuideInputProps> = ({ label, value, onChange, isTextArea }) => {
    const inputElement = isTextArea ? (
        <textarea id={label} value={value} onChange={onChange} className={styles.input} />
    ) : (
        <input type="text" id={label} value={value} onChange={onChange} className={styles.input} />
    );

    return (
        <div className={styles.inputWrapper}>
            <label htmlFor={label}>{label}</label>
            {inputElement}
        </div>
    );
};

export default GuideInput; // Updated export