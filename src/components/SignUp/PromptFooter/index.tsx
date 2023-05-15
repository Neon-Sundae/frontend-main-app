import clsx from 'clsx';
import { updateSignUpStep } from 'actions/auth';
import { useDispatch } from 'react-redux';
import { FC, useEffect } from 'react';
import { SignupSteps } from 'interfaces/auth';
import styles from './index.module.scss';

interface IPromptFooter {
  prev: SignupSteps;
  next: SignupSteps;
  isDisabled: boolean;
  isSubmitted: boolean;
}

const PromptFooter: FC<IPromptFooter> = ({
  prev,
  next,
  isDisabled,
  isSubmitted,
}) => {
  const dispatch = useDispatch();

  const handleBackFunc = () => {
    dispatch(updateSignUpStep(prev));
  };

  useEffect(() => {
    if (isSubmitted) dispatch(updateSignUpStep(next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

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
      <input
        type="submit"
        form="hook-form"
        className={styles['prompt-footer-container--continue-button']}
        value="Continue"
        disabled={isDisabled}
      />
    </div>
  );
};

export default PromptFooter;
