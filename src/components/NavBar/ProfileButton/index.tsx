import { FC } from 'react';
import clsx from 'clsx';
import ProfileImage from 'assets/images/profile/user-image.png';
import styles from './index.module.scss';

const ProfileButton: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles['image-cont']}>
        <div className={styles.image}>
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
            <span>8D4322...DFDFSD</span>
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
