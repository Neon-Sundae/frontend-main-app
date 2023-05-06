import clsx from 'clsx';
import { setSignUpStep } from 'actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { FC } from 'react';
import { getSessionStorageItem } from 'utils/sessionStorageFunc';
import styles from './index.module.scss';

interface IPromptFooter {
  active: boolean;
}

const PromptFooter: FC<IPromptFooter> = ({ active }) => {
  const step = useSelector((state: RootState) => state.user.step);
  const dispatch = useDispatch();

  const handleBackFunc = () => {
    if (step === 0 || step === 6) dispatch(setSignUpStep(1));
    else dispatch(setSignUpStep(step - 1));
  };

  const handleContinueFunc = () => {
    const isFlow = getSessionStorageItem('flow');
    if (isFlow === 'founder') {
      if (step < 6) dispatch(setSignUpStep(6));
      if (step >= 6) dispatch(setSignUpStep(step + 1));
    }
    if (isFlow === 'builder') dispatch(setSignUpStep(step + 1));
  };

  return (
    <div className={styles['prompt-footer-container']}>
      <button
        className={styles['prompt-footer-container--back-button']}
        aria-label="back"
        onClick={handleBackFunc}
      >
        <i className={clsx('material-icons', styles['arrow_back-icon'])}>
          arrow_back
        </i>
      </button>
      <button
        className={styles['prompt-footer-container--continue-button']}
        aria-label="continue"
        onClick={handleContinueFunc}
        disabled={active}
      >
        Continue
      </button>
    </div>
  );
};

export default PromptFooter;
