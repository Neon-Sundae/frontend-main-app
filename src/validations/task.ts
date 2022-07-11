import { Option } from 'components/Select';
import { Dispatch, SetStateAction } from 'react';

export interface ICreateTaskError {
  nameError: boolean;
  categoryError: boolean;
  difficultyError: boolean;
  priceError: boolean;
  dueDateError: boolean;
}

export const validateCreateTask = (
  name: string,
  category: Option | null,
  estimatedDifficulty: Option | null,
  price: string,
  dueDate: string,
  setError: Dispatch<SetStateAction<ICreateTaskError>>
) => {
  let tempErrors: ICreateTaskError = {
    nameError: false,
    categoryError: false,
    difficultyError: false,
    priceError: false,
    dueDateError: false,
  };

  if (name.length < 2) {
    tempErrors = { ...tempErrors, nameError: true };
  }
  if (category === null) {
    tempErrors = { ...tempErrors, categoryError: true };
  }
  if (estimatedDifficulty === null) {
    tempErrors = { ...tempErrors, difficultyError: true };
  }
  if (price.length === 0) {
    tempErrors = { ...tempErrors, priceError: true };
  }
  if (dueDate.length < 2) {
    tempErrors = { ...tempErrors, dueDateError: true };
  }

  setError(tempErrors);

  return !(
    tempErrors.nameError ||
    tempErrors.categoryError ||
    tempErrors.difficultyError ||
    tempErrors.priceError ||
    tempErrors.dueDateError
  );
};
