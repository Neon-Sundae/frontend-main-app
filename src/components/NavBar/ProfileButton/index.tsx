import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import ProfileImage from 'assets/images/profile/user-image.png';
import styles from './index.module.scss';
import { RootState } from 'reducers';


const ProfileButton: FC = () => {

  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles['image-cont']}>
        <div
          className={styles.image}
          onClick={() => {
            navigate('/profile');
          }}
        >
          <img src={ProfileImage} alt="your profile" />
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
          <div
          //	TODO - Implement center ellipsis for text overflow
          >
            <span>{user?.walletId?.slice(0, 6)}...{user?.walletId?.slice(user?.walletId.length - 6, user?.walletId.length)}</span>
          </div>
          <span className="material-icons">keyboard_arrow_down</span>
        </div>
        <div className={clsx(styles['text--secondary'], styles['text--align'])}>
          <span>On-Chain Wallet</span>
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
