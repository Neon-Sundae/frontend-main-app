import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from 'components/NavBar';
import ProfileCard from 'components/ProfileCard';
import { getItem, setItem } from 'utils/localStorageFn';
import BlurBlobs from 'components/BlurBlobs';
import { useFetchProfileDetails } from 'queries/profile';
import TourProfilePage from './tour';

import styles from './index.module.scss';
import ProfileContent from '../ProfileContent';

const Landing: FC = () => {
  const params = useParams();
  const { tourStep, tourStart } = TourProfilePage();
  const [onboardStatus, setOnboardStatus] = useState(getItem('onboardStatus'));

  const { data } = useFetchProfileDetails({
    profileId: params.profileId,
  });

  window.addEventListener('storage', () => {
    setOnboardStatus(localStorage.getItem('onboardStatus'));
  });

  useEffect(() => {
    if (onboardStatus === 'started') {
      setTimeout(() => {
        tourStart();
        setItem('onboardStatus', 'done');
      }, 1000);
    }
    if (onboardStatus === 'partial') {
      tourStep('step3');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardStatus]);

  if (data) {
    return (
      <>
        <BlurBlobs />
        <div className={styles.container}>
          <NavBar />
          <div className={styles['profile-card-content-container']}>
            <ProfileCard />
            <ProfileContent />
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default Landing;
