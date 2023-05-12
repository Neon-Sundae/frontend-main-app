import clsx from 'clsx';
import { FC } from 'react';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import { SignupSteps } from 'interfaces/auth';
import styles from './index.module.scss';
import WorkIcon from './Icons/WorkIcon';
import CategoryIcon from './Icons/CategoryIcon';
import TeamIcon from './Icons/TeamIcon';
import WalletIcon from './Icons/WalletIcon';

const StepProgressBar = () => {
  const step = useSelector((state: RootState) => state.auth.step);

  const fillCalc = () => {
    switch (step) {
      case SignupSteps.UserType:
        return 25;
      case SignupSteps.WorkType:
        return 50;
      case SignupSteps.Objective:
        return 75;
      case SignupSteps.Email:
        return 100;
      case SignupSteps.SignupOptions:
        return 100;
      default:
        return null;
    }
  };

  if (step === SignupSteps.Welcome) return null;

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
          <WorkIcon active={step === SignupSteps.UserType} />
          {step === SignupSteps.UserType && (
            <StepMessage message="Let's  Go! 🚀" />
          )}
        </span>

        <span className={styles['step-icons-message-container']}>
          <CategoryIcon active={step === SignupSteps.WorkType} />
          {step === SignupSteps.WorkType && (
            <StepMessage message="You're amazing 👍" />
          )}
        </span>

        <span className={styles['step-icons-message-container']}>
          <TeamIcon active={step === SignupSteps.Objective} />
          {step === SignupSteps.Objective && (
            <StepMessage message="Making Work Fun 🍦" />
          )}
        </span>

        <span className={styles['step-icons-message-container']}>
          <WalletIcon active={step === SignupSteps.SignupOptions} />
          {step === SignupSteps.SignupOptions && (
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
