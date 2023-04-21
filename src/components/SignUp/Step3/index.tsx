import { FC, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';
import styles from './index.module.scss';

interface IStep3 {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  showOptions: boolean;
  active: string;
}

const choices = [
  'Collaboratively build projects with community',
  'Manage projects',
  'Post jobs and hire Superstars',
  'Find jobs',
  'Host and run hackathons',
  'Sales & CRM',
  'Build and manage workflows',
  'Others',
];

const Step3: FC<IStep3> = ({
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
    <div className={styles['step3-container']}>
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']} />
        <div className={styles['user-choices']}>
          <TypeAnimation
            style={{
              display: 'block',
            }}
            sequence={[
              'Awesome stuff [Name], how are you planning to \n use Neon Sundae?',
              500,
              () => {
                setShowOptions(true);
              },
            ]}
            cursor={false}
            speed={80}
          />
          <p className={styles['user-choices--text']}>* Choose one or more</p>
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

export default Step3;
