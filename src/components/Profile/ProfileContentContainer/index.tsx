import { FC, ReactNode } from 'react';
import styles from './index.module.scss';

interface IProfileContentContainer {
  children: ReactNode;
}

const ProfileContentContainer: FC<IProfileContentContainer> = ({
  children,
}) => {
  return <div className={styles['profile-content-container']}>{children}</div>;
};

export default ProfileContentContainer;
