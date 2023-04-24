import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';
import { ReactComponent as TeamIcon } from 'assets/illustrations/icons/team.svg';
import { FC } from 'react';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from 'utils/sessionStorageFunc';
import styles from './index.module.scss';

interface IStep1 {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
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

  const name = getSessionStorageItem('name');

  return (
    <div className={styles['chat-prompts-container--chat-message']}>
      <div className={styles['user-image']} />
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
              setShowOptions(true);
            },
          ]}
          cursor={false}
          speed={80}
        />
        {showOptions && (
          <span>
            <button
              id="1"
              className={clsx(
                styles['choice-option'],
                active === '1' ? styles.active : undefined
              )}
              onClick={handleChoiceClick}
            >
              ‍‍‍👨‍💻 <hr /> For Personal Use
            </button>
            <button
              id="2"
              className={clsx(
                styles['choice-option'],
                active === '2' ? styles.active : undefined
              )}
              onClick={handleChoiceClick}
            >
              <TeamIcon height={50} width={50} />
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
