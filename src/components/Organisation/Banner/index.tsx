import { FC } from 'react';
import gradient from 'assets/illustrations/organisation/gradient.svg';
import { ReactComponent as Apple } from 'assets/illustrations/organisation/apple.svg';
import styles from './index.module.scss';

const Banner: FC = () => {
  return (
    <div className={styles.container}>
      <div
        className={styles.gradient}
        style={{ backgroundImage: `url(${gradient})` }}
      />
      <div className={styles.content}>
        <div className={styles.logo}>
          <Apple width={95} height={117} />
        </div>
      </div>
    </div>
  );
};

export default Banner;
