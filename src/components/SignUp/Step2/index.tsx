import { TypeAnimation } from 'react-type-animation';
import { FC, useEffect } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

interface IStep2 {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  showOptions: boolean;
  active: string;
}

const choices = [
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
  useEffect(() => {
    setActive('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles['step-2-container']}>
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']} />
        <div className={styles['user-choices']}>
          <TypeAnimation
            style={{
              whiteSpace: 'pre-line',
              display: 'block',
              marginBottom: '25px',
            }}
            sequence={[
              'Great [Name]! ✨ \n \n What best describes the work that you do?',
              500,
              () => {
                setShowOptions(true);
              },
            ]}
            cursor={false}
            speed={80}
          />
          {showOptions && (
            <>
              <span>
                {choices.map((choice, i) => {
                  console.log(choice);

                  return (
                    <ChoiceButton
                      id={(i + 1).toString()}
                      setActive={setActive}
                      active={active}
                      text={choice}
                    />
                  );
                })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface IChoiceButton {
  id: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  active: string;
  text: string;
}

const ChoiceButton: FC<IChoiceButton> = ({ id, setActive, active, text }) => {
  const handleChoiceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLInputElement;
    setActive(button.id);
  };

  return (
    <button
      id={id}
      className={clsx(
        styles['choice-option'],
        active === id ? styles.active : undefined
      )}
      onClick={handleChoiceClick}
    >
      {text}
    </button>
  );
};

export default Step2;
