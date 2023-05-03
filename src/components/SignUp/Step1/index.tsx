import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';
import { ReactComponent as TeamIcon } from 'assets/illustrations/icons/team.svg';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from 'utils/sessionStorageFunc';
import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import styles from './index.module.scss';

interface IStep1 {
  setActive: Dispatch<SetStateAction<string>>;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
  showOptions: boolean;
  active: string;
}

const Step1: FC<IStep1> = ({
  setActive,
  setShowOptions,
  showOptions,
  active,
}) => {
  const handleChoiceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLInputElement;
    setSessionStorageItem('flow', button.id === '1' ? 'builder' : 'founder');
    setActive(button.id);
  };
  const [showStepOneOptions, setShowStepOneOptions] = useState(false);

  const name = getSessionStorageItem('name');

  return (
    <div className={styles['chat-prompts-container--chat-message']}>
      <div className={styles['user-image']}>
        <NeonSundaeMainLogo width={70} height={85.75} />
      </div>
      <div className={styles['user-choices']}>
        <TypeAnimation
          style={{
            whiteSpace: 'pre-line',
            display: 'block',
          }}
          sequence={[
            `Hey ${name}, welcome to the Neonverse! ✨ \n We’re excited to get you started, how you are planning to use Neon Sundae?`,
            500,
            () => {
              setShowStepOneOptions(true);
            },
          ]}
          cursor={false}
          speed={80}
        />
        {showStepOneOptions && (
          <span>
            <button
              id="1"
              className={clsx(
                styles['choice-option'],
                active === '1' && styles.active
              )}
              onClick={handleChoiceClick}
            >
              <h2>‍‍‍👨‍💻</h2>
              <hr /> For Personal Use
            </button>
            <button
              id="2"
              className={clsx(
                styles['choice-option'],
                active === '2' && styles.active
              )}
              onClick={handleChoiceClick}
            >
              <h2>👯</h2>
              <hr />
              For My Team
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default Step1;
