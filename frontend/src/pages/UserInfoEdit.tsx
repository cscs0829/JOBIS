import React from 'react';
import styles from './UserInfoEdit.module.scss';
import UserEditNavbar from '../components/UserEdit/UserEditNavbar';
import UserInfoEditForm from '../components/UserEdit/UserInfoEditForm';

const UserInfoEdit = () => {
    const handleSubmit = (data: any) => {
        // 회원 정보 수정 로직 처리
        console.log('회원 정보 수정:', data);
    };

    return (
        <div className={styles.userEdit}>
            <div className={styles.userEditContainer}>
                <div className={styles.userEditLeft}>
                    <UserEditNavbar />
                </div>
                <div className={styles.userEditRight}>
                    <UserInfoEditForm onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default UserInfoEdit;