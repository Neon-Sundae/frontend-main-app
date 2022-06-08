import { FC } from 'react';
import clsx from 'clsx';
import userImage from 'assets/images/profile/user-image.png';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import styles from './index.module.scss';

const BasicDetails: FC = () => {
  return (
    <>
      <ProfileImage />
      <NameDesignation />
      <ExperiencePoints />
      <ProfileAddressChain />
    </>
  );
};

const ProfileImage: FC = () => {
  return (
    <div className={styles.ProfileImage}>
      <div className={styles.ImageWrapper}>
        <img alt="user" className={styles.Image} src={userImage} />
      </div>
    </div>
  );
};

const NameDesignation: FC = () => {
  return (
    <div className={styles.NameDesignation}>
      <h2 className={styles.Name}>Rachel Green</h2>
      <h5 className={styles.Designation}>Product Designer</h5>
    </div>
  );
};

const ExperiencePoints: FC = () => {
  return (
    <div className={styles.ExperiencePoints}>
      <span className={styles.Value}>
        1230 <span className={styles.Label}>XP</span>
      </span>
    </div>
  );
};

const ProfileAddressChain: FC = () => {
  return (
    <div className={styles.ProfileAddressChain}>
      <div className={styles.AddressContainer}>
        <FoundersLabIcon width={28} height={28} />
        <p className={styles.ProfileAddress}>6j6p2W....TzLSHWQfFc</p>
        <i className={clsx('material-icons-200', styles.CopyIcon)}>
          content_copy
        </i>
      </div>
      <p className={styles.SyncText}>
        Sync On Chain{' '}
        <i className={clsx('material-icons-200', styles.SyncIcon)}>sync</i>
      </p>
    </div>
  );
};

export default BasicDetails;
