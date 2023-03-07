import IconButton from 'components/IconButton';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import { useRef, useState } from 'react';
import { LoginModalContent } from 'components/Login/LoginModal';
import {
  useMetamaskLogin,
  useUnstoppableDomains,
  useWalletConnectLogin,
} from 'components/Login/Step1/hooks';
import styles from './index.module.scss';

const style = {
  width: '268.65px',
  height: '58.12px',
  borderRadius: '20px',
};

const udStyle = {
  width: '268.65px',
  height: '58.12px',
  borderRadius: '20px',
  fontFamily: 'var(--font-family-montserrat)',
  fontSize: '15px',
};

const SignUpForm = () => {
  const [error, setError] = useState('');
  const [active, setActive] = useState('');

  const [showMetamask, setShowMetamask] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const generateNonce = useMetamaskLogin();
  const walletConnectGenerateNonce = useWalletConnectLogin();
  const unstoppableDomains = useUnstoppableDomains();

  const loginWithMetaMask = () => {
    setShowMetamask(true);
    generateNonce({ setError });
  };

  const handleMetamaskLogin = () => {
    setActive('metamask');

    setShowEmail(false);
    if (typeof window.ethereum !== 'undefined') {
      loginWithMetaMask();
    } else {
      setShowMetamask(true);
    }
  };

  const loginWithWalletConnect = async () => {
    setActive('walletConnect');
    walletConnectGenerateNonce({ setError });
  };

  const loginWithUd = () => {
    setActive('udLogin');
    unstoppableDomains.login();
  };

  const handleEmailLogin = () => {
    setActive('emailLogin');
    setShowMetamask(false);
    setShowEmail(true);
  };

  return (
    <div className={styles['sign-up-form']}>
      <section className={styles['sign-up-form--option-select']}>
        <p>Select wallet to sign-up</p>
        <IconButton
          handleClick={handleMetamaskLogin}
          icon={<MetamaskIcon width={26.98} height={24.32} />}
          text="&nbsp; Metamask"
          style={style}
          active={active === 'metamask'}
        />
        <IconButton
          handleClick={loginWithWalletConnect}
          icon={<WalletConnectIcon width={26.98} height={24.32} />}
          text="&nbsp; Wallet Connect"
          style={style}
          active={active === 'walletConnect'}
        />
        <IconButton
          handleClick={loginWithUd}
          icon={<UDIcon width={26.98} height={24.32} />}
          text="&nbsp; UNSTOPPABLE DOMAINS"
          style={udStyle}
          active={active === 'udLogin'}
        />
        <p>or sign up via email</p>
        <IconButton
          handleClick={handleEmailLogin}
          icon={<></>}
          text="Verified Email"
          style={style}
          active={active === 'emailLogin'}
        />
      </section>

      <section className={styles['sign-up-form--option-details']}>
        {showMetamask && (
          <div>
            <h2>Opening MetaMask...</h2>
            <p>Confirm connection in the extension</p>
            <br />
            <button onClick={handleMetamaskLogin}>Retry</button>
          </div>
        )}
        {showEmail && (
          <>
            <h2>Signup with email</h2>
            <h3>
              We&apos;ll email you with a login link for a password free sign
              in.
            </h3>

            <input
              className={styles['sign-up-form--option-details--email']}
              placeholder="Enter email here"
            />
            <button>Get link</button>
          </>
        )}
        {!showMetamask && !showEmail && <LoginModalContent />}
      </section>
    </div>
  );
};

export default SignUpForm;
