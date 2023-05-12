import {
  UPDATE_LOGIN_STEP,
  UPDATE_FIRST_TIME_USER,
  UPDATE_CURRENT_SIGN_UP_STEP,
  UPDATE_ARCANA_AUTH_ADDRESS,
  UPDATE_SIGNUP_STEP,
} from 'actions/auth/types';
import { SignupSteps } from 'interfaces/auth';

interface State {
  loginStep: number;
  currentSignUpStep: string;
  isFirstTimeUser: boolean | undefined;
  arcanaAuth: {
    address: string | undefined;
  };
  step: SignupSteps;
}

type Action =
  | {
      type: typeof UPDATE_LOGIN_STEP;
      loginStep: number;
    }
  | {
      type: typeof UPDATE_FIRST_TIME_USER;
      isFirstTimeUser: boolean;
    }
  | {
      type: typeof UPDATE_CURRENT_SIGN_UP_STEP;
      currentSignUpStep: string;
    }
  | {
      type: typeof UPDATE_ARCANA_AUTH_ADDRESS;
      address: string;
    }
  | {
      type: typeof UPDATE_SIGNUP_STEP;
      step: SignupSteps;
    };

const initialState: State = {
  loginStep: 1,
  isFirstTimeUser: undefined,
  currentSignUpStep: 'step0',
  arcanaAuth: {
    address: undefined,
  },
  step: SignupSteps.Welcome,
};

const auth = (state = initialState, action: Action): State => {
  switch (action.type) {
    case UPDATE_LOGIN_STEP:
      return {
        ...state,
        loginStep: action.loginStep,
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
    case UPDATE_ARCANA_AUTH_ADDRESS:
      return {
        ...state,
        arcanaAuth: {
          address: action.address,
        },
      };
    case UPDATE_SIGNUP_STEP:
      return {
        ...state,
        step: action.step,
      };
    default:
      return { ...state };
  }
};

export default auth;
