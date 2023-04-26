import clsx from 'clsx';
import { FC } from 'react';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';
import WorkIcon from './Icons/WorkIcon';
import CategoryIcon from './Icons/CategoryIcon';
import TeamIcon from './Icons/TeamIcon';
import WalletIcon from './Icons/WalletIcon';

const StepProgressBar = () => {
  const step = useSelector((state: RootState) => state.user.step);

  const fillCalc = () => {
    switch (step) {
      case 1:
        return 25;
      case 2:
        return 50;
      case 3:
      case 4:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        return 75;
      case 5:
        return 100;
      case 13:
        return 100;
      default:
        return null;
    }
  };

  if (step === 0) return null;

  return (
    <div className={styles['step-progress-bar-container']}>
      <div
        className={
          styles['step-progress-bar-container--progress-bar-container']
        }
      >
        <div className={styles['progress-bar']} />
        <div
          className={clsx(
            styles[`progress-indicator`],
            styles[`fill-progress-${fillCalc()}`]
          )}
        />
      </div>

      <div className={styles['step-progress-bar-container--step-icons']}>
        <span className={styles['step-icons-message-container']}>
          <WorkIcon active={step === 1} />
          {step === 1 && <StepMessage message="Let's  Go! 🚀" />}
        </span>

        <span className={styles['step-icons-message-container']}>
          <CategoryIcon active={step === 2 || step === 6} />
          {(step === 2 || step === 6) && (
            <StepMessage message="You're amazing 👍" />
          )}
        </span>

        <span className={styles['step-icons-message-container']}>
          <TeamIcon
            active={
              step === 3 ||
              step === 4 ||
              step === 7 ||
              step === 8 ||
              step === 10 ||
              step === 11 ||
              step === 12
            }
          />
          {(step === 3 ||
            step === 4 ||
            step === 7 ||
            step === 8 ||
            step === 9 ||
            step === 10 ||
            step === 11 ||
            step === 12) && <StepMessage message="Making Work Fun 🍦" />}
        </span>

        <span className={styles['step-icons-message-container']}>
          <WalletIcon active={step === 5 || step === 13} />
          {(step === 5 || step === 13) && (
            <StepMessage message="Into The Neonverse 🔥" />
          )}
        </span>
      </div>
    </div>
  );
};

interface IStepMessage {
  message: string;
}

const StepMessage: FC<IStepMessage> = ({ message }) => {
  return (
    <div className={styles['step-message']}>
      <p>{message}</p>
    </div>
  );
};

export default StepProgressBar;
