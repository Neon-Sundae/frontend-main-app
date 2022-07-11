import { FC, useState } from 'react';
import clsx from 'clsx';
import StartOrgModal from 'components/StartOrgModal';
import StartPrjModal from 'components/StartPrjModal';
import styles from './index.module.scss';

const Banner: FC = () => {
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showPrjModal, setShowPrjModal] = useState(false);

  const handleOrgModalShow = () => {
    setShowOrgModal(true);
  };

  const handleOrgModalClose = () => {
    setShowOrgModal(false);
  };

  const handlePrjModalShow = () => {
    setShowPrjModal(true);
  };

  const handlePrjModalClose = () => {
    setShowPrjModal(false);
  };

  return (
    <>
      <div className={clsx(styles.banner, styles.glass)}>
        <div className={styles.content}>
          <span className={styles['text--secondary']}>Welcome back</span>
          <span className={styles['text--primary']}>Rachel!</span>
        </div>
        <div>
          <BannerBtn title="Start a Project" onClick={handlePrjModalShow} />
          <BannerBtn title="Create Organisation" onClick={handleOrgModalShow} />
        </div>
      </div>
      {showOrgModal && <StartOrgModal onClose={handleOrgModalClose} />}
      {showPrjModal && <StartPrjModal onClose={handlePrjModalClose} />}
    </>
  );
};

interface BannerBtnProps {
  title: string;
  onClick: () => void;
}

const BannerBtn: FC<BannerBtnProps> = ({ title, onClick }) => {
  return (
    <button
      type="button"
      className={clsx(styles.bannerBtn, styles.glass)}
      onClick={onClick}
    >
      <span className={styles.title}>{title}</span>
      <span className={clsx('material-icons', styles.icon)}>trending_flat</span>
    </button>
  );
};

export default Banner;
