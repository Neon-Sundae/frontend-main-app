import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bg from 'assets/illustrations/profile/bg.svg';
import NavBar from 'components/NavBar';
import ProfileCard from 'components/ProfileCard';
import { removeItem } from 'utils/localStorageFn';
import TourProfilePage from './tour';

import styles from './index.module.scss';
import ProfileContent from '../ProfileContent';
import { useFetchPublicProfile } from './hooks';

const Landing: FC = () => {
  const [onboardStatus, setOnboardStatus] = useState(
    localStorage.getItem('onboardStatus')
  );
  const { tourStep, tourStart } = TourProfilePage();
  window.addEventListener('storage', () => {
    setOnboardStatus(localStorage.getItem('onboardStatus'));
  });
  useEffect(() => {
    if (onboardStatus === 'started') {
      setTimeout(() => {
        tourStart();
      }, 1000);
    }
    if (onboardStatus === 'partial') {
      tourStep('step3');
      removeItem('onboardStatus');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardStatus]);

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
