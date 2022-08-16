import { FC } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import ProfileCard from 'components/ProfileCard';
import styles from './index.module.scss';
import ProfileContent from '../ProfileContent';
import { useFetchPublicProfile } from './hooks';

const Landing: FC = () => {
  const { profileId } = useParams();
  useFetchPublicProfile(profileId);

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
};

export default Landing;
