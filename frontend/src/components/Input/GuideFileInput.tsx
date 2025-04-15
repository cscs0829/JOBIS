import React, { ChangeEvent } from 'react';
import styles from './GuideFileInput.module.scss'; //  Updated import

interface GuideFileInputProps { // Updated interface name
    label: string;
    id?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const GuideFileInput: React.FC<GuideFileInputProps> = ({ label, id, onChange }) => {
    return (
        <div className={styles.fileInputWrapper}>
            <label htmlFor={id}>{label}</label>
            <input type="file" id={id} onChange={onChange} style={{ display: 'none' }} />
        </div>
    );
};

export default GuideFileInput; // Updated export