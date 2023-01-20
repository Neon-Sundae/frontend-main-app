import { FC, useState } from 'react';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import IconButton from 'components/IconButton';
import styles from './index.module.scss';
import { useUnstoppableDomains } from './hooks';
import LoginModal from '../LoginModal';
import EmailLoginModal from '../EmailLoginModal';

const Step1: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const unstoppableDomains = useUnstoppableDomains();

  const loginWithUd = () => {
    unstoppableDomains.login();
  };

  const showLoginModal = () => {
    setShowModal(true);
  };

  return (
    <>
      {!showEmailModal && (
        <>
          <h1 className={styles.title}>Welcome to Neon Sundae!</h1>
          <p className={styles.subtitle}>connect your wallet to get started.</p>
          <IconButton
            handleClick={showLoginModal}
            icon={<></>}
            text="Connect Wallet"
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
          <button
            onClick={() => setShowEmailModal(true)}
            className={styles.btn}
          >
            Login with email
          </button>
        </>
      )}
      {showEmailModal && <EmailLoginModal />}

      {showModal && (
        <LoginModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
};

export default Step1;
