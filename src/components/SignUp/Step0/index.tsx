import { updateCurrentSignUpStep } from 'actions/auth';
import { IChoice } from 'interfaces/auth';
import { ChangeEvent, FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'reducers';
import { setItem } from 'utils/sessionStorageFunc';
import ChoiceButton from '../ChoiceButton';
import styles from './index.module.scss';

const choicesArray = [
  { id: 0, value: 'I am a builder looking to build with projects 🧑‍💻' },
  { id: 1, value: 'I have an organisation  🚀' },
];

const Step0: FC = () => {
  const dispatch = useDispatch();

  const [activeButton, setActiveButton] = useState<string>('');
  const navigate = useNavigate();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setItem('name', value);
  };

  const handleChoiceSelection = (choice: IChoice) => {
    setActiveButton(`step${choice.id}`);
  };

  const handleSubmit = () => {
    dispatch(updateCurrentSignUpStep(activeButton));
    if (activeButton === 'step0') dispatch(updateCurrentSignUpStep('step3'));
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
