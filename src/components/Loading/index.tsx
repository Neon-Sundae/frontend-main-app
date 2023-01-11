import { FC } from 'react';
import Lottie from 'lottie-react';
import loading from 'assets/lottie/loading.json';
import messages from 'assets/data/loading.json';
import bg from 'assets/illustrations/gradients/bg.png';
import emojis from 'utils/emojis';
import styles from './index.module.scss';

const Loading: FC = () => {
  const x = Math.floor(Math.random() * messages.length + 1);
  return (
    <div
      className={styles.backdrop}
      style={{
        backgroundColor: '#242529',
      }}
    >
      <div className={styles.overlay}>
        <Lottie animationData={loading} />
        <p>
          {messages[x]} {emojis[x]}
        </p>
      </div>
    </div>
  );
};

export default Loading;
