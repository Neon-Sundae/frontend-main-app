import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import Header from '../Header';
import Description from '../Description';
import { RootState } from 'reducers';
import useProject from './hooks';
import { getAccessToken } from 'utils/authFn';
import PublishProjectModal from '../Modal/PublishProjectModal';
import { Toaster } from 'react-hot-toast';

const Landing: FC = () => {

  const { getUSDCBalance, getOnChainProject, deployedAddress, budget } = useProject();

  const [open, setOpen] = useState(false);

  const { user, wallet_usdc_balance } = useSelector((state: RootState) => state.user);
  const { usdcBalance, profileContractAddress } = useSelector((state: RootState) => state.profile);
  const accessToken = getAccessToken();

  const projectId = 1;

  useEffect(() => {
    if (user?.userId && accessToken) {
      getUSDCBalance();
      getOnChainProject(projectId);
    }
  }, [user])

  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar usdcBalance={usdcBalance} profileAddress={profileContractAddress} />
      <Header setOpen={(val) => setOpen(val)} projectAddress={deployedAddress} budget={budget} />
      <Description />
      {
        open && <PublishProjectModal setOpen={(val) => setOpen(val)} usdcBalance={wallet_usdc_balance} />
      }
      <Toaster />
    </div>
  );
};

export default Landing;
