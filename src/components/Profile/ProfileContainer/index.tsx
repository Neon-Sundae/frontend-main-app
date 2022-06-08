import { FC } from 'react';
import ProfileCard from '../ProfileCard';
import styles from './index.module.scss';

const ProfileContainer: FC = () => {
  return (
    <div className={styles.ProfileContainer}>
      <ProfileCard />
    </div>
  );
};

export default ProfileContainer;
