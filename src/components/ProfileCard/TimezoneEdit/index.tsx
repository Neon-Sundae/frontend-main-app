import { FC } from 'react';
import { ReactComponent as LocationIcon } from 'assets/illustrations/profile/location.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';

const TimezoneEdit: FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  return (
    <div className={styles['timezone-container']}>
      <LocationIcon width={14} height={19.7} />
      <span>{profile?.timezone ?? 'Singapore GMT+8'}</span>
    </div>
  );
};

export default TimezoneEdit;
