import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import clsx from 'clsx';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import { useFetchUserDetailsWrapper } from 'queries/user';
import { useFetchProfileDetailsByUserWrapper } from 'queries/profile';
import styles from './index.module.scss';
import DisconnectModal from './DisconnectModal';

const ProfileButton: FC = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsByUserWrapper({
    userId: userData?.user?.userId,
  });

  const pictureFunc = () => {
    return (
      profileData?.picture ||
      getDefaultAvatarSrc(userData?.user?.name?.charAt(0).toUpperCase())
    );
  };

  const handleNavigation = () => {
    navigate(`/profile/${userData?.user?.userId}`);
    // * To reload the page because with SPA navigation, the data was not refreshing
    // navigate(0);
  };

  const getFormattedWalletId = () => {
    if (userData?.user?.walletId) {
      return `${userData?.user.walletId.slice(
        0,
        6
      )}...${userData?.user.walletId.slice(
        // eslint-disable-next-line no-unsafe-optional-chaining
        userData?.user.walletId.length - 6,
        userData?.user.walletId.length
      )}`;
    }

    return '';
  };

  const getFormattedDomainName = () => {
    if (userData?.user?.domain) {
      return `${userData.user.domain.slice(
        0,
        6
      )}...${userData.user.domain.slice(
        userData.user.domain.length - 6,
        userData?.user.domain.length
      )}`;
    }
    return '';
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles['image-cont']}
        title="Visit Profile"
        onClick={handleNavigation}
      >
        <div className={styles.image}>
          <img src={pictureFunc()} alt="your profile" />
        </div>
        <p className={styles['profile-text']}>Profile</p>
      </div>
      <div
        id="navbar-wallet-information"
        className={styles.content}
        title="Wallet Information"
        onClick={handleOpen}
      >
        <p className={styles['navbar-username']}>{userData?.user?.name}</p>
        <span
          className={styles['navbar-wallet-address']}
          title={
            userData?.user?.domain
              ? userData?.user.domain
              : userData?.user?.walletId
          }
        >
          {userData?.user?.domain
            ? getFormattedDomainName()
            : getFormattedWalletId()}
        </span>
        <div className={clsx(styles['text--secondary'], styles['text--align'])}>
          <span>Connected Wallet</span>
          <WalletConnIndicator />
        </div>
      </div>
      {open && (
        <DisconnectModal
          handleClose={handleClose}
          pictureFunc={pictureFunc}
          getFormattedWalletId={getFormattedWalletId}
          getFormattedDomainName={getFormattedDomainName}
        />
      )}
      <Toaster />
    </div>
  );
};

const WalletConnIndicator: FC = () => {
  return (
    <div className={styles['indicator-outer']}>
      <div className={styles['indicator-fill']} />
    </div>
  );
};

export default ProfileButton;
