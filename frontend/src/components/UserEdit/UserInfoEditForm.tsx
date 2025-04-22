// src/components/UserEdit/UserInfoEditForm.tsx
import React from 'react';
import styles from './UserInfoEditForm.module.scss';
import Input from '../Input/Input';
import { UserEditFormData } from '../../types/types'; // Import the interface

interface UserInfoEditFormProps {
    onSubmit: (data: UserEditFormData) => void;
    initialData?: UserEditFormData;
}

const UserInfoEditForm: React.FC<UserInfoEditFormProps> = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = React.useState<UserEditFormData>(initialData || {
        mem_nick: '',
        mem_email: '',
        mem_phone: '',
        mem_addr: '',
        mem_birthdate: '',
        mem_gender: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className={styles.formContainer}>
            <h2>회원 정보 수정</h2>
            <form onSubmit={handleSubmit}>
                <Input label="닉네임" name="nickname" value={formData.mem_nick} onChange={handleChange} />
                <Input label="이메일" name="email" value={formData.mem_email} onChange={handleChange} />
                <Input label="전화번호" name="phone" value={formData.mem_phone} onChange={handleChange} />
                <Input label="주소" name="address" value={formData.mem_addr} onChange={handleChange} />
                <button type="submit" className={styles.submitButton}>저장</button>
            </form>
        </div>
    );
};

export default UserInfoEditForm;