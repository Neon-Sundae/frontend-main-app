import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import ProfileImage from 'assets/images/profile/user-image.svg';
import { RootState } from 'reducers';
import styles from './index.module.scss';
import DisconnectModal from './DisconnectModal';

const ProfileButton: FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);
  const navbarProfile = useSelector(
    (state: RootState) => state.profile.navbarProfile
  );

  const pictureFunc = () => {
    return navbarProfile?.image ? navbarProfile?.image : ProfileImage;
  };

  const handleNavigation = () => {
    navigate(`/profile/${user?.userId}`);
    // * To reload the page because with SPA navigation, the data was not refreshing
    navigate(0);
  };

  const getFormattedWalletId = () => {
    if (user?.walletId) {
      return `${user?.walletId?.slice(0, 6)}...${user?.walletId?.slice(
        // eslint-disable-next-line no-unsafe-optional-chaining
        user?.walletId.length - 6,
        user?.walletId.length
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
        <p className={styles['navbar-username']}>{user?.name}</p>
        <span className={styles['navbar-wallet-address']}>
          {getFormattedWalletId()}
        </span>
        <div className={clsx(styles['text--secondary'], styles['text--align'])}>
          <span>On-Chain Wallet</span>
          <WalletConnIndicator />
        </div>
      </div>
      {open && (
        <DisconnectModal
          handleClose={handleClose}
          pictureFunc={pictureFunc}
          getFormattedWalletId={getFormattedWalletId}
        />
      )}
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
