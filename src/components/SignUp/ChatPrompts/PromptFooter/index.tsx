import clsx from 'clsx';
import { setSignUpStep } from 'actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';

const PromptFooter = () => {
  const step = useSelector((state: RootState) => state.user.step);
  const dispatch = useDispatch();

  const handleBackFunc = () => {
    dispatch(setSignUpStep(step - 1));
  };

  const handleContinueFunc = () => {
    dispatch(setSignUpStep(step + 1));
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
      >
        Continue
      </button>
    </div>
  );
};

export default PromptFooter;
