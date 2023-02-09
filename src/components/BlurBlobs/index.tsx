import { FC } from 'react';
import styles from './index.module.scss';

const BlurBlobs: FC = () => {
  return (
    <div className={styles['background-gradient']}>
      <div className={styles['window-blob-purple']} />
      <div className={styles['window-blob-pink']} />
      <div className={styles['window-blob-dark-purple']} />
    </div>
  );
};

export default BlurBlobs;
