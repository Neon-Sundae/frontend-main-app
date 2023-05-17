import clsx from 'clsx';
import { FC } from 'react';
import styles from './index.module.scss';

interface IPromptFooter {
  prev: () => void;
  isDisabled: boolean;
}

const PromptFooter: FC<IPromptFooter> = ({ prev, isDisabled }) => {
  return (
    <div className={styles['prompt-footer-container']}>
      <button
        className={styles['prompt-footer-container--back-button']}
        aria-label="back"
        onClick={prev}
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
