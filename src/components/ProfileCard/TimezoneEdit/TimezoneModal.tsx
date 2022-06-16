import { Dispatch, FC, SetStateAction } from 'react';
import Modal from 'components/Modal';
import gradientBtn from 'assets/illustrations/button/button-gradient.svg';
import timezoneData from 'assets/data/timezones.json';
import styles from './index.module.scss';
import useUpdateProfileTimezone from './hooks';

interface IProfileSkills {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const TimezoneModal: FC<IProfileSkills> = ({ setOpen }) => {
  const updateProfileTimezone = useUpdateProfileTimezone();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (timezone: string) => {
    updateProfileTimezone({ timezone, setOpen });
  };

  return (
    <Modal onClose={handleClose}>
      <h1 className={styles['timezone-title']}>Timezone</h1>
      <div className={styles['timezone-data-container']}>
        {timezoneData.map(t => (
          <TimezoneRow
            key={`${t.value}-${t.abbr}`}
            value={t.text}
            handleSelect={handleSelect}
          />
        ))}
      </div>
      <div className={styles['gradient-save-btn']} onClick={handleClose}>
        <div
          className={styles['gradient-blur']}
          style={{ backgroundImage: `url(${gradientBtn})` }}
        />
        <p>Save</p>
      </div>
    </Modal>
  );
};

interface ITimezoneRow {
  value: string;
  handleSelect: (value: string) => void;
}

const TimezoneRow: FC<ITimezoneRow> = ({ value, handleSelect }) => {
  const handleClick = () => handleSelect(value);

  return (
    <div className={styles['timezone-row']} onClick={handleClick}>
      <p>{value}</p>
      <hr />
    </div>
  );
};

export default TimezoneModal;
