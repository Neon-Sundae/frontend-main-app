import { FC } from 'react';
import Lottie from 'lottie-react';
import loading from 'assets/lottie/loading.json';
import styles from './index.module.scss';

const Loading: FC = () => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.overlay}>
        <Lottie animationData={loading} />
        {/* TODO: text styling */}
        {/* <h2>Please wait</h2>
        <p>Something's up 🤦</p> */}
      </div>
    </div>
  );
};

export default Loading;
