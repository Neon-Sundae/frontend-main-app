import { FC } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

const Banner: FC = () => {
  return (
    <div className={clsx(styles.banner, styles.glass)}>
      <div className={styles.content}>
        <span className={styles['text--secondary']}>Welcome back</span>
        <span className={styles['text--primary']}>Rachel!</span>
      </div>
      <div>
        <BannerBtn title="Start a Project" onClick={() => {}}/>
        <BannerBtn title="Create Organisation" onClick={() => {}}/>
      </div>
    </div>
  );
};

interface BannerBtnProps {
  title: string;
	onClick: () => void;
}

const BannerBtn: FC<BannerBtnProps> = ({ title, onClick }) => {
  return (
    <button type="button" className={clsx(styles.bannerBtn, styles.glass)} onClick={onClick}>
      <span className={styles.title}>{title}</span>
      <span className={clsx('material-icons', styles.icon)}>trending_flat</span>
    </button>
  );
};

export default Banner;
