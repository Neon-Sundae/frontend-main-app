import { useSelector } from 'react-redux';
import { FC, useEffect } from 'react';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import ProfileCard from 'components/ProfileCard';
import styles from './index.module.scss';
import ProfileContent from '../ProfileContent';
import useProfile from './hooks';
import { getAccessToken } from 'utils/authFn';
import { RootState } from 'reducers';

const Landing: FC = () => {

  const { user } = useSelector((state: RootState) => state.user);

  const {
    fetchOffChainProfileData,
  } = useProfile();

  const accessToken = getAccessToken();

  useEffect(() => {
    if (user?.userId && accessToken) {
      fetchOffChainProfileData();
    }
  }, [user])

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
