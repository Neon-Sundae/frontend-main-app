import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from 'utils/sessionStorageFunc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';

interface IStep3 {
  setActive: Dispatch<SetStateAction<string>>;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
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
  const onboardFlow = getSessionStorageItem('flow');
  const [activeButtons, setActiveButtons] = useState([]);
  const step = useSelector((state: RootState) => state.user.step);
  const dispatch = useDispatch();
  const name = getSessionStorageItem('name');

  useEffect(() => {
    setActive('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (onboardFlow === 'founder') {
    // dispatch(setSignUpStep(step + 1));
  }

  const checkActive = (id: string) => {
    return activeButtons.filter(
      (button: { id: string; choice: string }) => button.id === id
    );
  };

  if (activeButtons.length === 0) setActive('');

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
              `Awesome stuff ${name}, how are you planning to \n use Neon Sundae?`,
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
                  return (
                    <ChoiceButton
                      id={(i + 1).toString()}
                      setActive={setActive}
                      active={
                        checkActive((i + 1).toString()).length
                          ? (i + 1).toString()
                          : ''
                      }
                      text={choice}
                      activeButtons={activeButtons}
                      setActiveButtons={setActiveButtons}
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
  setActive: Dispatch<SetStateAction<string>>;
  active: string;
  text: string;
  activeButtons: any[];
  setActiveButtons: any;
}

const ChoiceButton: FC<IChoiceButton> = ({
  id,
  setActive,
  active,
  text,
  activeButtons,
  setActiveButtons,
}) => {
  const handleChoiceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLInputElement;
    const prevAddedButton = activeButtons.filter(
      (prevButton: { id: string; choice: string }) =>
        prevButton.id === button.id
    );
    if (prevAddedButton.length) {
      const index = activeButtons.indexOf(prevAddedButton[0]);
      activeButtons.splice(index, 1);
      setActiveButtons(activeButtons);
    } else {
      activeButtons.push({ id: button.id, choice: button.innerText });
    }
    setActiveButtons(activeButtons);
    setActive(button.id);
    setSessionStorageItem('choices', JSON.stringify(activeButtons));
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
