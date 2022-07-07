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

  const { xp, usdcBalance, profileContractAddress } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.user);
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  const { fetchOnChainProfileData, fetchOffChainProfileData, getProfileContractAddress } = useProfile();

  const accessToken = getAccessToken();

  useEffect(() => {
    if (walletId !== undefined) {
      getProfileContractAddress(walletId);
    }
  }, [walletId]);

  useEffect(() => {
    if (user?.userId && accessToken) {
      fetchOffChainProfileData();
    }
  }, [user])

  useEffect(() => {
    if (profileContractAddress !== "0x0000000000000000000000000000000000000000" && profileContractAddress !== "") {
      fetchOnChainProfileData(profileContractAddress);
    }
  }, []);

  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar usdcBalance={usdcBalance} />
      <div className={styles['profile-card-content-container']}>
        <ProfileCard xp={xp} profileAddress={profileContractAddress} />
        <ProfileContent />
      </div>
    </div>
  );
};

export default Landing;
