import { FC, useState } from 'react';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import IconButton from 'components/IconButton';
import styles from './index.module.scss';
import { useMetamaskLogin, useWalletConnectLogin } from './hooks';

const Step1: FC = () => {
  const [error, setError] = useState('');

  const generateNonce = useMetamaskLogin();
  const walletConnectGenerateNonce = useWalletConnectLogin();

  const loginWithMetaMask = () => {
    generateNonce({ setError });
  };

  const loginWithWalletConnect = async () => {
    walletConnectGenerateNonce({ setError });
  };

  return (
    <>
      <h1 className={styles.title}>
        Welcome to Founders Lab, <br /> connect your wallet <br /> to get
        started.
      </h1>
      <IconButton
        handleClick={loginWithMetaMask}
        icon={<MetamaskIcon width={39} height={35} />}
        text="Metamask"
      />
      <IconButton
        handleClick={loginWithWalletConnect}
        icon={<WalletConnectIcon width={39} height={35} />}
        text="WalletConnect"
      />
      {error && <p className={styles['error-text']}>{error}</p>}
    </>
  );
};

export default Step1;
