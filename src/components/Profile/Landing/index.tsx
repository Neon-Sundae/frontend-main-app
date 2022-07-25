import { FC } from 'react';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import ProfileCard from 'components/ProfileCard';
import useFetchOffChainProfile from 'hooks/useFetchOffChainProfile';
import styles from './index.module.scss';
import ProfileContent from '../ProfileContent';

const Landing: FC = () => {
  // const { offChainProfile } = useFetchOffChainProfile();

  // if (offChainProfile) {
  return (
    <div className={styles.container}>
      <NavBar />
      <BlurBlobs />
      <div className={styles['profile-card-content-container']}>
        <ProfileCard />
        <ProfileContent />
      </div>
    </div>
  );
  // }

  // return null;
};

export default Landing;
