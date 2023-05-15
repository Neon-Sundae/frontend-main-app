import clsx from 'clsx';
import { updateSignUpStep } from 'actions/auth';
import { useDispatch } from 'react-redux';
import { FC } from 'react';
import { SignupSteps } from 'interfaces/auth';
import styles from './index.module.scss';

interface IPromptFooter {
  prev: SignupSteps;
  next: SignupSteps;
  isDisabled: boolean;
}

const PromptFooter: FC<IPromptFooter> = ({ prev, next, isDisabled }) => {
  const dispatch = useDispatch();

  const handleBackFunc = () => {
    dispatch(updateSignUpStep(prev));
  };

  const handleContinueFunc = () => {
    dispatch(updateSignUpStep(next));
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
        type="submit"
        form="hook-form"
        className={styles['prompt-footer-container--continue-button']}
        aria-label="continue"
        onClick={handleContinueFunc}
        disabled={isDisabled}
      >
        Continue
      </button>
    </div>
  );
};

export default PromptFooter;
