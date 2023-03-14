import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import StartOrgModal from 'components/StartOrgModal';
import StartPrjModal from 'components/StartPrjModal';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { removeItem } from 'utils/localStorageFn';
import styles from './index.module.scss';
import OnboardModal from '../OnboardModal';

interface IBanner {
  showOnboardModal?: any;
  setShowOnboardModal?: any;
  tourStart?: any;
}

const Banner: FC<IBanner> = ({
  showOnboardModal,
  setShowOnboardModal,
  tourStart,
}) => {
  const userName = useSelector((state: RootState) => state.user.user?.name);

  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showPrjModal, setShowPrjModal] = useState(false);

  useEffect(() => {
    removeItem('file');
    removeItem('name');
    removeItem('orgData');
    removeItem('choices');
  }, []);

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
          <span className={styles['text--primary']}>{userName}!</span>
        </div>
        <div>
          <BannerBtn title="Start a Project" onClick={handlePrjModalShow} />
          <BannerBtn title="Create Organisation" onClick={handleOrgModalShow} />
        </div>
      </div>
      {showOrgModal && <StartOrgModal onClose={handleOrgModalClose} />}
      {showPrjModal && <StartPrjModal onClose={handlePrjModalClose} />}
      {showOnboardModal && (
        <OnboardModal
          tourStart={tourStart}
          setShowOnboardModal={setShowOnboardModal}
        />
      )}
    </>
  );
};

interface BannerBtnProps {
  title: string;
  onClick: () => void;
}

export const BannerBtn: FC<BannerBtnProps> = ({ title, onClick }) => {
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

Banner.defaultProps = {
  showOnboardModal: null,
  setShowOnboardModal: null,
  tourStart: null,
};

export default Banner;
