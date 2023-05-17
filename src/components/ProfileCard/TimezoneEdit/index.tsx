import { FC, useState } from 'react';
import { ReactComponent as LocationIcon } from 'assets/illustrations/profile/location.svg';
import { useParams } from 'react-router-dom';
import { useFetchProfileDetailsWrapper } from 'queries/profile';
import styles from './index.module.scss';
import TimezoneModal from './TimezoneModal';

const TimezoneEdit: FC = () => {
  const params = useParams();
  const profileData = useFetchProfileDetailsWrapper(params.profileId);
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);

  return (
    <>
      <div className={styles['timezone-container']} onClick={handleOpenModal}>
        <LocationIcon width={14} height={19.7} />
        <span>{profileData?.timezone ?? 'Singapore GMT+8'}</span>
      </div>
      {open && <TimezoneModal setOpen={setOpen} />}
    </>
  );
};

export default TimezoneEdit;
