import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bg from 'assets/illustrations/profile/bg.svg';
import NavBar from 'components/NavBar';
import ProfileCard from 'components/ProfileCard';
import TourProfilePage from './tour';

import styles from './index.module.scss';
import ProfileContent from '../ProfileContent';
import { useFetchPublicProfile } from './hooks';

const Landing: FC = () => {
  const [onboardStatus, setOnboardStatus] = useState(
    localStorage.getItem('onboardStatus')
  );

  const { tourStep } = TourProfilePage();

  window.addEventListener('storage', () => {
    setOnboardStatus(localStorage.getItem('onboardStatus'));
  });
  useEffect(() => {
    if (onboardStatus === 'started') {
      tourStep('step1');
    }
    if (onboardStatus === 'partial') {
      tourStep('step3');
      localStorage.removeItem('onboardStatus');
    }
    if (onboardStatus === 'minted') {
      tourStep('step3');
      localStorage.removeItem('onboardStatus');
    }
  }, [onboardStatus, tourStep]);

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
