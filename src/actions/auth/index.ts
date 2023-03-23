import {
  UPDATE_CURRENT_STEP,
  UPDATE_FIRST_TIME_USER,
  UPDATE_CURRENT_SIGN_UP_STEP,
} from './types';

export const updateCurrentStep = (currentStep: number) => ({
  type: UPDATE_CURRENT_STEP,
  currentStep,
});

export const updateFirstTimeUser = (isFirstTimeUser: boolean) => ({
  type: UPDATE_FIRST_TIME_USER,
  isFirstTimeUser,
});

export const updateCurrentSignUpStep = (currentSignUpStep: string) => ({
  type: UPDATE_CURRENT_SIGN_UP_STEP,
  currentSignUpStep,
});
