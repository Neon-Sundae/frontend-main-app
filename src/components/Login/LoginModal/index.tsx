import { FC, useState } from 'react';
import Modal from 'components/Modal';
import styles from './index.module.scss';
import IconButton from 'components/IconButton';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import { useMetamaskLogin, useWalletConnectLogin } from '../Step1/hooks';

interface LoginModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const LoginModal: FC<LoginModalProps> = ({ showModal, setShowModal }) => {
  const [error, setError] = useState('');
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

  // todo - show error in react toast
  console.log(error);
  if (!showModal) return null;
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
            text={'Metamask'}
            handleClick={loginWithMetaMask}
            style={buttonStyles}
          />
          <IconButton
            icon={<WalletConnectIcon width={26} height={23.4} />}
            text={'Wallet Connect'}
            handleClick={loginWithWalletConnect}
            style={buttonStyles}
          />
        </div>
        <div className={styles['login-modal--details']}>
          <h2 className={styles['login-modal--section-heading']}>
            What is a Wallet?
          </h2>
          <span>
            <h3 className={styles['login-modal--section-sub-heading']}>
              A Home for your Digital Assets
            </h3>
            <p>
              Wallets are used to send, receive, store, and display digital
              assets like Ethereum and NFTs.
            </p>
          </span>
          <span>
            <h3 className={styles['login-modal--section-sub-heading']}>
              A New Way to Log In
            </h3>
            <p>
              Instead of creating new accounts and passwords on every website,
              just connect your wallet.
            </p>
          </span>
          <button className={styles['login-modal--get-wallet-btn']}>
            Get Wallet
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
