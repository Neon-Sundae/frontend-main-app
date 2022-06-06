import { FC } from 'react';
import videoSrc from 'assets/videos/bg.mp4';
import styles from './index.module.scss';

const Background: FC = () => {
  return (
    <video
      autoPlay
      muted
      loop
      id="bgvid"
      className={styles['background-video-container']}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
};

export default Background;
