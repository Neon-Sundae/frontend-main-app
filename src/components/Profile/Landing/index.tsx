import { FC } from 'react';
import { useParams } from 'react-router-dom';
import bg from 'assets/illustrations/profile/bg.svg';
import NavBar from 'components/NavBar';
import ProfileCard from 'components/ProfileCard';
import styles from './index.module.scss';
import ProfileContent from '../ProfileContent';
import { useFetchPublicProfile } from './hooks';

const Landing: FC = () => {
  const { profileId } = useParams();
  useFetchPublicProfile(profileId);

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bg})` }}>
      <NavBar />
      <div className={styles['profile-card-content-container']}>
        <ProfileCard />
        <ProfileContent />
      </div>
    </div>
  );
};

export default Landing;
