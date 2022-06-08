import { FC } from 'react';
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
      <ProfileBio />
    </>
  );
};

const ProfileImage: FC = () => {
  return (
    <div className={styles['profile-image']}>
      <div className={styles['image-wrapper']}>
        <img alt="user" src={userImage} />
      </div>
    </div>
  );
};

const NameDesignation: FC = () => {
  return (
    <div className={styles['name-designation']}>
      <h2 className={styles.name}>Rachel Green</h2>
      <h5 className={styles.designation}>Product Designer</h5>
    </div>
  );
};

const ExperiencePoints: FC = () => {
  return (
    <div className={styles['experience-points']}>
      <span className={styles.value}>
        1230 <span className={styles.label}>XP</span>
      </span>
    </div>
  );
};

const ProfileAddressChain: FC = () => {
  return (
    <div className={styles['profile-address-chain']}>
      <div className={styles['address-container']}>
        <FoundersLabIcon width={28} height={28} />
        <p className={styles['profile-address']}>6j6p2W....TzLSHWQfFc</p>
        <i className="material-icons-200">content_copy</i>
      </div>
      <p className={styles['sync-text']}>
        Sync On Chain <i className="material-icons-200">sync</i>
      </p>
    </div>
  );
};

const ProfileBio: FC = () => {
  return (
    <p className={styles['profile-bio']}>
      BioLorem imsum text is here imsum text is here imsum text is here imsum
      text is here imsum text is here imsum text is here imsum text is here
      imsum.
    </p>
  );
};

export default BasicDetails;
