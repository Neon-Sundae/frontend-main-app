import { UPDATE_CURRENT_STEP, UPDATE_FIRST_TIME_USER } from './types';

export const updateCurrentStep = (currentStep: number) => ({
  type: UPDATE_CURRENT_STEP,
  currentStep,
});

export const updateFirstTimeUser = (isFirstTimeUser: boolean) => ({
  type: UPDATE_FIRST_TIME_USER,
  isFirstTimeUser,
});
