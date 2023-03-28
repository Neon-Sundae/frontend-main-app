import { updateCurrentSignUpStep } from 'actions/auth';
import { IChoice } from 'interfaces/auth';
import { FC, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSessionStorageItem } from 'utils/sessionStorageFunc';
import ChoiceButton from '../ChoiceButton';
import styles from './index.module.scss';

const choicesArray = [
  { id: 0, value: 'Run Business Development with community' },
  { id: 1, value: 'Manage Projects with the community' },
  { id: 2, value: 'Use Neon Sundae Tools to build my product' },
  { id: 3, value: 'Easily Manage my online communities' },
  { id: 4, value: 'Post Jobs and Hire Superstars' },
  { id: 5, value: 'Host and Run Hackathons' },
];

const Step1: FC = () => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<IChoice[]>([]);

  const elementRef: any = useRef();

  const handleClick = (choice: IChoice) => {
    const result = selected.find((obj: IChoice) => obj.id === choice.id);

    if (result) {
      elementRef.current.children[1].children[choice.id].style.border = 'none';
      const filteredData = selected.filter(
        (elem: IChoice) => elem.id !== choice.id
      );
      setSelected(filteredData);
    } else {
      elementRef.current.children[1].children[choice.id].style.border =
        '2px solid #fff';
      const filteredData = [...selected, choice];
      setSelected(filteredData);
    }
  };

  const handleSubmit = () => {
    setSessionStorageItem('choices', JSON.stringify(selected));
    dispatch(updateCurrentSignUpStep('step2'));
  };

  return (
    <>
      <div className={styles['step1-container']} ref={elementRef}>
        <p className={styles['step1-container--heading-text']}>
          What do you want to do on Neon Sundae?
        </p>
        <form
          className={styles['step1-container--form']}
          onSubmit={handleSubmit}
        >
          {choicesArray?.map((choice: IChoice) => (
            <ChoiceButton
              key={choice.id}
              width="380px"
              height="80px"
              selectObjective={handleClick}
              choice={choice}
              activeButton={false}
            />
          ))}

          <input
            className={styles['step1-container--form-submit-button']}
            type="submit"
            value="Next"
            disabled={!selected.length}
          />
        </form>
      </div>
    </>
  );
};

export default Step1;
