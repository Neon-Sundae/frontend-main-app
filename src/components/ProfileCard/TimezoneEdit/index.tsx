import { FC, useState } from 'react';
import { ReactComponent as LocationIcon } from 'assets/illustrations/profile/location.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';
import TimezoneModal from './TimezoneModal';

const TimezoneEdit: FC = () => {
  const [open, setOpen] = useState(false);
  const profile = useSelector((state: RootState) => state.profile.profile);

  const handleOpenModal = () => setOpen(true);

  return (
    <>
      <div className={styles['timezone-container']} onClick={handleOpenModal}>
        <LocationIcon width={14} height={19.7} />
        <span>{profile?.timezone ?? 'Singapore GMT+8'}</span>
      </div>
      {open && <TimezoneModal setOpen={setOpen} />}
    </>
  );
};

export default TimezoneEdit;
