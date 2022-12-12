import { FC, useState } from 'react';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import IconButton from 'components/IconButton';
import styles from './index.module.scss';
import { useMetamaskLogin, useUnstoppableDomains } from './hooks';

const Step1: FC = () => {
  const [error, setError] = useState('');

  const generateNonce = useMetamaskLogin();
  const unstoppableDomains = useUnstoppableDomains();

  const loginWithMetaMask = () => {
    generateNonce({ setError });
  };

  const loginWithUd = () => {
    unstoppableDomains.login();
  };

  return (
    <>
      <h1 className={styles.title}>Welcome to Neon Sundae!</h1>
      <p className={styles.subtitle}>connect your wallet to get started.</p>
      <IconButton
        handleClick={loginWithMetaMask}
        icon={<MetamaskIcon width={25.8} height={23.26} />}
        text="Metamask"
      />
      <IconButton
        handleClick={loginWithUd}
        icon={<UDIcon width={39.59} height={43} />}
        text="UNSTOPPABLE DOMAIN"
        style={{
          fontFamily: 'Montserrat',
          fontSize: '15px',
          padding: '0 25px',
        }}
      />
      {error && <p className={styles['error-text']}>{error}</p>}
    </>
  );
};

export default Step1;
