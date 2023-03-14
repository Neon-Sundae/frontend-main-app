import { FC, useEffect, useRef, useState } from 'react';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import IconButton from 'components/IconButton';
import { Auth, useAuth, useProvider } from '@arcana/auth-react';
import { getAccessToken } from 'utils/authFn';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import clsx from 'clsx';
import styles from './index.module.scss';
import {
  useUnstoppableDomains,
  useArcanaWallet,
  useWalletConnectLogin,
  useMetamaskLogin,
} from './hooks';
import LoginModal from '../LoginModal';
import ArcanaAuthLogin from '../ArcanaAuthLogin';

const Step1: FC = () => {
  const refContainer = useRef<HTMLButtonElement>(null);
  const generateNonce = useMetamaskLogin();

  const onButtonClick = () => {
    const arcanaFormButton = refContainer.current
      ?.getElementsByTagName('form')[0]
      .getElementsByTagName('button')[0];
    arcanaFormButton?.click();
  };

  const [error, setError] = useState('');
  const [loginDone, setLoginDone] = useState(false);
  const provider = useProvider();
  const auth = useAuth();

  const [showModal, setShowModal] = useState(false);
  const unstoppableDomains = useUnstoppableDomains();
  const arcanaWallet = useArcanaWallet();
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

  // useEffect(() => {
  //   console.log('auth', auth);
  //   if (auth?.isLoggedIn && !getAccessToken()) {
  //     arcanaWallet.loginSuccess(auth.user?.address, provider.provider);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [auth]);

  const loginWithUd = () => {
    unstoppableDomains.login();
  };

  const showLoginModal = () => {
    setShowModal(true);
  };

  const onArcanaLogin = () => {
    // Route to authenticated page
    arcanaWallet.loginSuccess(auth.user?.address, provider.provider);
  };

  const style = {
    width: '67.97px',
    height: '67.97px',
    borderRadius: '20px',
  };

  return (
    <>
      <p className={styles.title}>Welcome to Neon Sundae!</p>
      <p className={styles.subtitle}>Choose Wallet to Login</p>
      <div className={styles['button-container']}>
        <IconButton
          handleClick={handleMetamaskLogin}
          icon={<MetamaskIcon width={26.98} height={24.32} />}
          text=""
          style={style}
        />
        <IconButton
          handleClick={loginWithUd}
          icon={<UDIcon width={26.98} height={24.32} />}
          text=" "
          style={style}
        />
        <IconButton
          icon={<WalletConnectIcon width={26.98} height={24.32} />}
          text=""
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
