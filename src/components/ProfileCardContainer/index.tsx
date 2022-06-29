import { FC, ReactNode } from 'react';
import gradient from 'assets/illustrations/profile/gradient.svg';
import styles from './index.module.scss';

interface IProfileCardContainer {
  children: ReactNode;
}

const ProfileCardContainer: FC<IProfileCardContainer> = ({ children }) => {
  return (
    <div
      className={styles['profile-card-container']}
      style={{ backgroundImage: `url(${gradient})`, backgroundSize: 'cover' }}
    >
      {children}
    </div>
  );
};

export default ProfileCardContainer;
