import clsx from 'clsx';
import { TypeAnimation } from 'react-type-animation';
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
            styles[`fill-progress-${25}`]
          )}
        />
      </div>

      <div className={styles['step-progress-bar-container--step-icons']}>
        <span className={styles['step-icons-message-container']}>
          <WorkIcon />
          {step === 1 && <StepMessage message="Let's  Go! 🚀" />}
        </span>

        <span className={styles['step-icons-message-container']}>
          <CategoryIcon />
          {step === 2 && <StepMessage message="You're amazing 👍" />}
        </span>

        <span className={styles['step-icons-message-container']}>
          <TeamIcon />
          {step === 3 && <StepMessage message="Making Work Fun 🍦" />}
        </span>

        <span className={styles['step-icons-message-container']}>
          <WalletIcon />
          {step === 4 && <StepMessage message="Into The Neonverse 🔥" />}
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
      <TypeAnimation
        sequence={[
          message,
          1500,
          () => {
            console.log('Sequence completed');
          },
        ]}
        cursor={false}
      />
    </div>
  );
};

export default StepProgressBar;
