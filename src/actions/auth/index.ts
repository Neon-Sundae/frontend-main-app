import { SignupSteps } from 'interfaces/auth';
import {
  UPDATE_LOGIN_STEP,
  UPDATE_FIRST_TIME_USER,
  UPDATE_CURRENT_SIGN_UP_STEP,
  UPDATE_ARCANA_AUTH_ADDRESS,
  UPDATE_SIGNUP_STEP,
  UPDATE_ONBOARDING_DATA,
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

export const updateArcanaAuthAddress = (address: string) => ({
  type: UPDATE_ARCANA_AUTH_ADDRESS,
  address,
});

export const updateSignUpStep = (step: SignupSteps) => ({
  type: UPDATE_SIGNUP_STEP,
  step,
});

export const updateOnboardingData = (data: {
  [key: string]: string | number | string[] | File | undefined;
}) => ({
  type: UPDATE_ONBOARDING_DATA,
  data,
});
