import { FC, useState } from 'react';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
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
        icon={<MetamaskIcon width={25.8} height={23.26} />} // TODO: change this icon
        text="Unstoppable Domain"
      />
      {error && <p className={styles['error-text']}>{error}</p>}
    </>
  );
};

export default Step1;
