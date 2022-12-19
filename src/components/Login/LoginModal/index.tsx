import { FC, useState } from 'react';
import Modal from 'components/Modal';
import IconButton from 'components/IconButton';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import clsx from 'clsx';
import styles from './index.module.scss';
import { useMetamaskLogin, useWalletConnectLogin } from '../Step1/hooks';

interface LoginModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const LoginModal: FC<LoginModalProps> = ({ showModal, setShowModal }) => {
  const [error, setError] = useState('');
  const [getWalletShow, setGetWalletShow] = useState(false);

  const generateNonce = useMetamaskLogin();
  const walletConnectGenerateNonce = useWalletConnectLogin();

  const loginWithMetaMask = () => {
    generateNonce({ setError });
  };

  const loginWithWalletConnect = async () => {
    walletConnectGenerateNonce({ setError });
  };

  const buttonStyles = {
    width: '244px',
    height: '66.2px',
    borderRadius: '12.23px',
    fontSize: '17.64px',
    fontWeight: 500,
  };

  if (!showModal) return null;
  console.log(typeof window.ethereum !== 'undefined');
  return (
    <Modal
      onClose={() => setShowModal(false)}
      width="697px"
      height="543px"
      overflowY="unset"
      padding="55px"
    >
      <div className={styles['login-modal']}>
        <div className={styles['login-modal--wallets']}>
          <h2 className={styles['login-modal--section-heading']}>
            Connect Wallet
          </h2>
          {typeof window.ethereum !== 'undefined' && (
            <IconButton
              icon={<MetamaskIcon width={26} height={23.4} />}
              text="Metamask"
              handleClick={loginWithMetaMask}
              style={buttonStyles}
            />
          )}
          <IconButton
            icon={<WalletConnectIcon width={26} height={23.4} />}
            text="Wallet Connect"
            handleClick={loginWithWalletConnect}
            style={buttonStyles}
          />
        </div>
        <div className={styles['login-modal--details']}>
          {!getWalletShow && (
            <LoginModalContent setGetWalletShow={setGetWalletShow} />
          )}
          {getWalletShow && (
            <GetWalletContent
              setGetWalletShow={setGetWalletShow}
              loginWithWalletConnect={loginWithWalletConnect}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

interface LoginModalContentProps {
  setGetWalletShow: (getWalletShow: boolean) => void;
}

const LoginModalContent: FC<LoginModalContentProps> = ({
  setGetWalletShow,
}) => {
  return (
    <>
      <h2 className={styles['login-modal--section-heading']}>
        What is a Wallet?
      </h2>
      <span>
        <h3 className={styles['login-modal--section-sub-heading']}>
          A Home for your Digital Assets
        </h3>
        <p>
          Wallets are used to send, receive, store, and display digital assets
          like Ethereum and NFTs.
        </p>
      </span>
      <span>
        <h3 className={styles['login-modal--section-sub-heading']}>
          A New Way to Log In
        </h3>
        <p>
          Instead of creating new accounts and passwords on every website, just
          connect your wallet.
        </p>
      </span>
      <button
        className={styles['login-modal--get-wallet-btn']}
        onClick={() => setGetWalletShow(true)}
      >
        Get Wallet
      </button>
    </>
  );
};

interface GetWalletContentProps {
  setGetWalletShow: (getWalletShow: boolean) => void;
  loginWithWalletConnect: () => void;
}

const GetWalletContent: FC<GetWalletContentProps> = ({
  setGetWalletShow,
  loginWithWalletConnect,
}) => {
  return (
    <div className={styles['get-wallet-connect']}>
      <div className={styles['get-wallet-connect--heading']}>
        <button
          className={styles['get-wallet-connect--heading-button']}
          onClick={() => setGetWalletShow(false)}
        >
          <i className={clsx('material-icons', styles['arrow-back'])}>
            arrow_back_ios
          </i>
        </button>
        <h2>Get a wallet</h2>
        <p>&nbsp;</p>
      </div>
      <div className={styles['get-wallet-connect--wallet-option']}>
        <span>
          <MetamaskIcon width={26} height={23.4} />
        </span>
        <span className={styles['get-wallet-connect--wallet-option-content']}>
          <p> Metamask</p>
          <p>Mobile Wallet and Extension</p>
        </span>
        <a href="https://metamask.io/download/" target="_new">
          <button>GET</button>
        </a>
      </div>
      <div className={styles['get-wallet-connect--wallet-option']}>
        <span>
          <WalletConnectIcon width={26} height={23.4} />
        </span>
        <span className={styles['get-wallet-connect--wallet-option-content']}>
          <p>Wallet Connect</p>
          <p>Mobile Wallet and Extension</p>
        </span>

        <button onClick={loginWithWalletConnect}>GET</button>
      </div>
    </div>
  );
};

export default LoginModal;
