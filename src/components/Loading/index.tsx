import { FC } from 'react';
import Lottie from 'lottie-react';
import loading from 'assets/lottie/loading.json';
import BlurBlobs from 'components/BlurBlobs';
import styles from './index.module.scss';

const Loading: FC = () => {
  return (
    <div className={styles.backdrop}>
      <BlurBlobs />
      <div className={styles.overlay}>
        <Lottie animationData={loading} />
      </div>
    </div>
  );
};

export default Loading;
