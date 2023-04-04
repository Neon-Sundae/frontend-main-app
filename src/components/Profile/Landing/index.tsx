import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from 'components/NavBar';
import ProfileCard from 'components/ProfileCard';
import { getItem, removeItem } from 'utils/localStorageFn';
import BlurBlobs from 'components/BlurBlobs';
import { useFetchProfileDetails } from 'queries/profile';
import TourProfilePage from './tour';

import styles from './index.module.scss';
import ProfileContent from '../ProfileContent';

const Landing: FC = () => {
  const params = useParams();
  const { tourStep, tourStart } = TourProfilePage();
  const onboardStatus = getItem('onboardStatus');

  const { data, isLoading } = useFetchProfileDetails({
    profileId: params.profileId,
  });

  useEffect(() => {
    if (!isLoading) {
      if (onboardStatus === 'started') {
        setTimeout(() => {
          tourStart();
        }, 1000);
      }
      if (onboardStatus === 'partial') {
        tourStep('step3');
        removeItem('onboardStatus');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardStatus, isLoading]);

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
