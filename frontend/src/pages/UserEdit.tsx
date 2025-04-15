import React, { useState, useEffect } from 'react';
import styles from './UserEdit.module.scss';
import UserEditNavbar from '../components/UserEdit/UserEditNavbar';
import UserEditForm from '../components/UserEdit/UserEditForm';
import { useSpring, animated } from 'react-spring';
import { UserEditFormProps } from '../types/types'; // UserEditFormProps 임포트

const userEditAnimation = {
    from: { width: '0%', opacity: '0%', transform: 'rotate(270deg) scale(0)' },
    to: { width: '100%', opacity: '100%', transform: 'rotate(360deg) scale(1)' },
};

const UserEdit = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [springs, api] = useSpring(() => userEditAnimation);

    useEffect(() => {
        api.start(userEditAnimation);
    }, []);

    return (
        <animated.div style={springs} className={styles.userEdit}>
            <div className={styles.userEditContainer}>
                <div className={styles.userEditLeft}>
                    <UserEditNavbar
                        selectedTab={selectedTab}
                        handleTabChange={setSelectedTab}
                    />
                </div>
                <div className={styles.userEditRight}>
                    <UserEditForm selectedTab={selectedTab} />
                </div>
            </div>
        </animated.div>
    );
};

export default UserEdit;