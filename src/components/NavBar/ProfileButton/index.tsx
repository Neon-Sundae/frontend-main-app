import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import ProfileImage from 'assets/images/profile/user-image.png';
import { RootState } from 'reducers';
import styles from './index.module.scss';

const ProfileButton: FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const navbarProfile = useSelector(
    (state: RootState) => state.profile.navbarProfile
  );

  const pictureFunc = () => {
    return navbarProfile?.image ?? ProfileImage;
  };

  const handleNavigation = () => {
    navigate(`/profile/${user?.userId}`);
    // * To reload the page because with SPA navigation, the data was not refreshing
    navigate(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles['image-cont']}>
        <div className={styles.image} onClick={handleNavigation}>
          <img src={pictureFunc()} alt="your profile" />
        </div>
      </div>
      <div className={styles.content}>
        <div
          className={clsx(
            styles['text--primary'],
            styles['text--align'],
            styles['text--clickable']
          )}
        >
          <span>
            {user?.walletId?.slice(0, 6)}...
            {user?.walletId?.slice(
              // eslint-disable-next-line no-unsafe-optional-chaining
              user?.walletId.length - 6,
              user?.walletId.length
            )}
          </span>
        </div>
        <div className={clsx(styles['text--secondary'], styles['text--align'])}>
          <span>My Wallet</span>
          <WalletConnIndicator />
        </div>
      </div>
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
