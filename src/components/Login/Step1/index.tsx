import { FC, useEffect, useState } from 'react';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import IconButton from 'components/IconButton';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import {
  useUnstoppableDomains,
  useWalletConnectLogin,
  useMetamaskLogin,
} from './hooks';
import LoginModal from '../LoginModal';
import ArcanaAuthLogin from '../ArcanaAuthLogin';

const Step1: FC = () => {
  const navigate = useNavigate();
  const generateNonce = useMetamaskLogin();

  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const unstoppableDomains = useUnstoppableDomains();
  const walletConnectGenerateNonce = useWalletConnectLogin();

  const loginWithWalletConnect = async () => {
    walletConnectGenerateNonce({ setError });
  };
  const loginWithMetaMask = () => {
    generateNonce({ setError });
  };
  const handleMetamaskLogin = () => {
    if (typeof window.ethereum !== 'undefined') {
      loginWithMetaMask();
    }
  };

  const loginWithUd = () => {
    unstoppableDomains.login(setError);
  };

  const style = {
    width: '67.97px',
    height: '67.97px',
    borderRadius: '20px',
  };

  if (error === 'Not Found') navigate('/sign_up');

  return (
    <>
      <p className={styles.title}>Welcome to Neon Sundae!</p>
      <p className={styles.subtitle}>Choose Wallet to Login</p>
      <div className={styles['button-container']}>
        <IconButton
          handleClick={handleMetamaskLogin}
          icon={<MetamaskIcon width={26.98} height={24.32} />}
          style={style}
        />
        <IconButton
          handleClick={loginWithUd}
          icon={<UDIcon width={26.98} height={24.32} />}
          style={style}
        />
        <IconButton
          icon={<WalletConnectIcon width={26.98} height={24.32} />}
          handleClick={loginWithWalletConnect}
          style={style}
        />
      </div>

      <ArcanaAuthLogin />
      {showModal && (
        <LoginModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
};

export default Step1;
