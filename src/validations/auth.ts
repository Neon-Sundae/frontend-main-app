import { Dispatch, SetStateAction } from 'react';

export interface ICreateProfileError {
  nameError: boolean;
  emailError: boolean;
  apiError: boolean;
}

export const validateCreateProfile = (
  name: string,
  email: string,
  setError: Dispatch<SetStateAction<ICreateProfileError>>
) => {
  let tempErrors: ICreateProfileError = {
    nameError: false,
    emailError: false,
    apiError: false,
  };

  if (name.length < 2) {
    tempErrors = { ...tempErrors, nameError: true };
  }
  if (email.length < 2) {
    tempErrors = { ...tempErrors, emailError: true };
  }

  setError(tempErrors);

  return !(tempErrors.nameError || tempErrors.emailError);
};
