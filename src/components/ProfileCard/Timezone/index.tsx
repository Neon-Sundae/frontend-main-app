import { FC } from 'react';
import { ReactComponent as LocationIcon } from 'assets/illustrations/profile/location.svg';
import styles from './index.module.scss';

const Timezone: FC = () => {
  return (
    <div className={styles['timezone-container']}>
      <LocationIcon width={14} height={19.7} />
      <span>Singapore GMT+8</span>
    </div>
  );
};

export default Timezone;
