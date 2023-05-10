import { TypeAnimation } from 'react-type-animation';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from 'utils/sessionStorageFunc';
import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import styles from './index.module.scss';

interface IStep2 {
  setActive: Dispatch<SetStateAction<string>>;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
  showOptions: boolean;
  active: string;
}

const choicesBuilder = [
  'Engineering',
  'Product Design',
  'Creative',
  'Operations',
  'Product Manager',
  'Marketing',
  'Sales',
  'Founder / CEO',
  'Human Resources',
  'Other',
];

const Step2: FC<IStep2> = ({
  setActive,
  setShowOptions,
  showOptions,
  active,
}) => {
  const name = getSessionStorageItem('name');
  const [showStepTwoOptions, setShowStepTwoOptions] = useState(false);

  useEffect(() => {
    setActive('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles['step-2-container']}>
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
              `Great ${name}! ✨ \n  What best describes the work that you do?`,
              500,
              () => {
                setShowStepTwoOptions(true);
              },
            ]}
            cursor={false}
            speed={80}
          />
          {showStepTwoOptions && (
            <span>
              {choicesBuilder.map(choice => (
                <ChoiceButton
                  key={choice}
                  setActive={setActive}
                  active={active}
                  text={choice}
                />
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface IChoiceButton {
  setActive: Dispatch<SetStateAction<string>>;
  active: string;
  text: string;
}

const ChoiceButton: FC<IChoiceButton> = ({ setActive, active, text }) => {
  const handleChoiceClick = () => {
    setSessionStorageItem('work', text);
    setActive(text);
  };

  return (
    <button
      id={text}
      className={clsx(
        styles['choice-option'],
        active === text ? styles.active : undefined
      )}
      onClick={handleChoiceClick}
    >
      {text}
    </button>
  );
};

export default Step2;
