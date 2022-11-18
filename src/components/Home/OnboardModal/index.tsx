import { ReactComponent as Hearts } from 'assets/illustrations/icons/hearts.svg';
import { ReactComponent as PlusPlus1 } from 'assets/illustrations/icons/modalPlusPlus.svg';
import { ReactComponent as PlusPlus2 } from 'assets/illustrations/icons/modalPlusPlus2.svg';
import clsx from 'clsx';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Shepherd from 'shepherd.js';
import BaseModal from '../BaseModal';
import styles from './index.module.scss';

interface IOnboardModal {
  tourStart?: any;
  setShowOnboardModal?: any;
}

const OnboardModal: FC<IOnboardModal> = ({
  tourStart,
  setShowOnboardModal,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const handleClick = () => {
    tourStart();
    if (Shepherd.activeTour?.isActive()) setShowOnboardModal(false);
  };
  return (
    <BaseModal header="" onClose={() => {}} onNext={() => {}} noCloseBtn>
      <PlusPlus1 width={29} height={28.19} />
      <div className={styles['onboard-modal-wrap']}>
        <Hearts width={138} height={155.92} />
        <h1 className={styles.heading}>Welcome {user && user.name}!</h1>
        <p className={styles.text}>
          I&apos;m Andy, I will be helping you setup your Neon Sundae Profile
          and show you how the rest of the things are done!
        </p>
        <button onClick={() => handleClick()}>
          Let&apos;s Start &nbsp;
          <i className={clsx('material-icons', styles['arrow-right'])}>
            arrow_right_alt
          </i>
        </button>
      </div>
      <PlusPlus2 width={29} height={28.19} />
    </BaseModal>
  );
};

OnboardModal.defaultProps = {
  tourStart: null,
  setShowOnboardModal: null,
};

export default OnboardModal;
