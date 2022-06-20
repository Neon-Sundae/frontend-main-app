import { FC } from 'react';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import ProfileCard from 'components/ProfileCard';
import styles from './index.module.scss';
import useGetProfileData from './hooks';
import ProfileContent from '../ProfileContent';

const Landing: FC = () => {
  useGetProfileData();

  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <div className={styles['profile-card-content-container']}>
        <ProfileCard />
        <ProfileContent />
      </div>
    </div>
  );
};

export default Landing;
