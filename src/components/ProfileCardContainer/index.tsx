import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { RootState } from 'reducers';
import gradient from 'assets/illustrations/profile/gradient.svg';
import styles from './index.module.scss';

interface IProfileCardContainer {
  children: ReactNode;
}

const ProfileCardContainer: FC<IProfileCardContainer> = ({ children }) => {
  const isEditable = useSelector(
    (state: RootState) => state.profile.isEditable
  );

  return (
    <div
      className={clsx(
        styles['profile-card-container'],
        isEditable && styles['profile-card-container--is-editable']
      )}
      style={{ backgroundImage: `url(${gradient})`, backgroundSize: 'cover' }}
    >
      {children}
    </div>
  );
};

export default ProfileCardContainer;
