import clsx from 'clsx';
import { IChoice } from 'interfaces/auth';
import { FC } from 'react';
import styles from './index.module.scss';

interface iChoiceButton {
  selectObjective: (choice: IChoice) => void;
  width: string;
  height: string;
  activeButton: boolean;
  choice: IChoice;
}

const ChoiceButton: FC<iChoiceButton> = ({
  selectObjective,
  width,
  height,
  activeButton,
  choice,
}) => {
  const { id, value } = choice;

  const handleClick = () => {
    selectObjective(choice);
  };

  return (
    <input
      type="button"
      id={id.toString()}
      className={clsx(
        styles['choice-button'],
        activeButton && styles['choice-button-active']
      )}
      onClick={handleClick}
      style={{
        width,
        height,
      }}
      value={value}
    />
  );
};

export default ChoiceButton;
