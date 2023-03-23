import {
  UPDATE_CURRENT_STEP,
  UPDATE_FIRST_TIME_USER,
  UPDATE_CURRENT_SIGN_UP_STEP,
} from 'actions/auth/types';

interface State {
  currentStep: number;
  currentSignUpStep: string;
  isFirstTimeUser: boolean | undefined;
}

type Action =
  | {
      type: typeof UPDATE_CURRENT_STEP;
      currentStep: number;
    }
  | {
      type: typeof UPDATE_FIRST_TIME_USER;
      isFirstTimeUser: boolean;
    }
  | {
      type: typeof UPDATE_CURRENT_SIGN_UP_STEP;
      currentSignUpStep: string;
    };

const initialState: State = {
  currentStep: 1,
  isFirstTimeUser: undefined,
  currentSignUpStep: 'step0',
};

const auth = (state = initialState, action: Action): State => {
  switch (action.type) {
    case UPDATE_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.currentStep,
      };
    case UPDATE_FIRST_TIME_USER:
      return {
        ...state,
        isFirstTimeUser: action.isFirstTimeUser,
      };
    case UPDATE_CURRENT_SIGN_UP_STEP:
      return {
        ...state,
        currentSignUpStep: action.currentSignUpStep,
      };
    default:
      return { ...state };
  }
};

export default auth;
