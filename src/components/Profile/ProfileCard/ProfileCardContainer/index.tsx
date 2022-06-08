import { FC, ReactNode } from 'react';
import gradient from 'assets/illustrations/profile/gradient.svg';
import styles from './index.module.scss';

interface IProfileCardContainer {
  children: ReactNode;
}

const ProfileCardContainer: FC<IProfileCardContainer> = ({ children }) => {
  return (
    <div
      className={styles.ProfileCardContainer}
      style={{ backgroundImage: `url(${gradient})` }}
    >
      {children}
    </div>
  );
};

export default ProfileCardContainer;
