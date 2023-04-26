import { FC } from 'react';
import { ReactComponent as LocationIcon } from 'assets/illustrations/profile/location.svg';
import { useParams } from 'react-router-dom';
import { useFetchProfileDetailsWrapper } from 'queries/profile';
import styles from './index.module.scss';

const Timezone: FC = () => {
  const params = useParams();
  const profileData = useFetchProfileDetailsWrapper(params.profileId);

  return (
    <div className={styles['timezone-container']}>
      <LocationIcon width={14} height={19.7} />
      <span>{profileData?.timezone ?? 'Singapore GMT+8'}</span>
    </div>
  );
};

export default Timezone;
