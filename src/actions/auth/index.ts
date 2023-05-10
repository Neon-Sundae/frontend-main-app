import {
  UPDATE_LOGIN_STEP,
  UPDATE_FIRST_TIME_USER,
  UPDATE_CURRENT_SIGN_UP_STEP,
} from './types';

export const updateLoginStep = (loginStep: number) => ({
  type: UPDATE_LOGIN_STEP,
  loginStep,
});

export const updateFirstTimeUser = (isFirstTimeUser: boolean) => ({
  type: UPDATE_FIRST_TIME_USER,
  isFirstTimeUser,
});

export const updateCurrentSignUpStep = (currentSignUpStep: string) => ({
  type: UPDATE_CURRENT_SIGN_UP_STEP,
  currentSignUpStep,
});
