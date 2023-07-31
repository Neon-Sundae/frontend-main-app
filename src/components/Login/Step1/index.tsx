import { FC, useState } from 'react';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import IconButton from 'components/IconButton';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { trackAmplitudeEvent } from 'config/amplitude';
import styles from './index.module.scss';
import {
  useUnstoppableDomains,
  useWalletConnectLogin,
  useMetamaskLogin,
} from './hooks';
import ArcanaAuthLogin from '../ArcanaAuthLogin';

const Step1: FC = () => {
  const navigate = useNavigate();
  const generateNonce = useMetamaskLogin();
  const unstoppableDomains = useUnstoppableDomains();
  const walletConnectGenerateNonce = useWalletConnectLogin();

  const [error, setError] = useState('');

  const loginWithWalletConnect = async () => {
    trackAmplitudeEvent('onb_loginmethod_click', {
      loginmethod: 'walletconnect',
    });
    walletConnectGenerateNonce({ setError });
  };

  const loginWithMetaMask = () => {
    if (typeof window.ethereum !== 'undefined') {
      trackAmplitudeEvent('onb_loginmethod_click', {
        loginmethod: 'metamask',
      });
      generateNonce({ setError });
    }
  };

  const loginWithUd = () => {
    trackAmplitudeEvent('onb_loginmethod_click', {
      loginmethod: 'unstoppable-domains',
    });
    unstoppableDomains.login(setError);
  };

  const style = {
    width: '67.97px',
    height: '67.97px',
    borderRadius: '20px',
  };

  if (error === 'Not Found') {
    toast.error('No user, taking you to sign up...');
    setTimeout(() => {
      navigate('/sign_up');
    }, 2000);
  }

  return (
    <>
      <p className={styles.title}>Welcome to Neon Sundae!</p>
      <p className={styles.subtitle}>Choose Wallet to Login</p>
      <div className={styles['button-container']}>
        <IconButton
          handleClick={loginWithMetaMask}
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
      {/* <ArcanaAuthLogin /> */}
    </>
  );
};

export default Step1;
