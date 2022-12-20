import { FC, useState } from 'react';
import Modal from 'components/Modal';
import IconButton from 'components/IconButton';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import styles from './index.module.scss';
import { useMetamaskLogin, useWalletConnectLogin } from '../Step1/hooks';

interface LoginModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const LoginModal: FC<LoginModalProps> = ({ showModal, setShowModal }) => {
  const [error, setError] = useState('');
  const [getWalletShow, setGetWalletShow] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const generateNonce = useMetamaskLogin();
  const walletConnectGenerateNonce = useWalletConnectLogin();

  const loginWithMetaMask = () => {
    generateNonce({ setError });
  };

  const handleMetamaskLogin = () => {
    if (typeof window.ethereum !== 'undefined') {
      loginWithMetaMask();
      setGetWalletShow(true);
    } else {
      setGetWalletShow(true);
      setShowQr(true);
    }
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

          <IconButton
            icon={<MetamaskIcon width={26} height={23.4} />}
            text="Metamask"
            handleClick={handleMetamaskLogin}
            style={buttonStyles}
          />

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
            <MetamaskLogin
              setGetWalletShow={setGetWalletShow}
              handleMetamaskLogin={handleMetamaskLogin}
              showQr={showQr}
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
    </>
  );
};

interface MetamaskLoginProps {
  setGetWalletShow: (getWalletShow: boolean) => void;
  handleMetamaskLogin: any;
  showQr: boolean;
}

const MetamaskLogin: FC<MetamaskLoginProps> = ({
  setGetWalletShow,
  handleMetamaskLogin,
  showQr,
}) => {
  if (showQr) {
    return (
      <div className={styles['metmask-login']}>
        <h2>Install Metamask</h2>
        <p>Scan with your phone to download on iOS or Android</p>
        <img src="/src/assets/illustrations/icons/metamask-qr.png" alt="scannable qr code" />
        <span>
        <p >Don't have Metamask?</p>
        <a href="https://metamask.io/download/">
          <button>Get</button>
        </a>
        </span>
      </div>
    );
  }
  return (
    <div className={styles['metmask-login']}>
      <h2>Opening MetaMask...</h2>
      <p>Confirm connection in the extension</p>
      <br />
      <button onClick={handleMetamaskLogin}>Retry</button>
    </div>
  );
};

export default LoginModal;
