import { IChoice } from 'interfaces/auth';
import { ChangeEvent, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setItem } from 'utils/localStorageFn';
import ChoiceButton from '../ChoiceButton';
import styles from './index.module.scss';

interface iStep0 {
  setStep: React.Dispatch<React.SetStateAction<string | null>>;
}

const choicesArray = [
  { id: 0, value: 'I am a builder looking to build with projects 🧑‍💻' },
  { id: 1, value: 'I have an organisation  🚀' },
];

const Step0: FC<iStep0> = ({ setStep }) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setItem('name', value);
  };

  const handleChoiceSelection = (choice: IChoice) => {
    setActiveButton(`step${choice.id}`);
  };

  const handleSubmit = () => {
    setStep(activeButton);
    if (activeButton === 'step0') setStep('step3');
  };

  return (
    <div className={styles['step0-container']}>
      <form className={styles['step0-container--form']} onSubmit={handleSubmit}>
        <span>
          <p className={styles['step0-container--header-text']}>
            Hello
            <input onChange={handleNameChange} required />! Tell us why you are
            here.
          </p>
        </span>

        <span className={styles['step0-container--choice-buttons']}>
          {choicesArray.map(choice => {
            return (
              <ChoiceButton
                selectObjective={handleChoiceSelection}
                width="213px"
                height="185px"
                choice={choice}
                activeButton={`step${choice.id}` === activeButton}
              />
            );
          })}
        </span>

        <input
          type="submit"
          value="Next"
          disabled={!activeButton}
          className={styles['step0-container--submit-button']}
        />
      </form>
      <footer className={styles['step0-container--footer']}>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')}>Login</button>
      </footer>
    </div>
  );
};

export default Step0;
