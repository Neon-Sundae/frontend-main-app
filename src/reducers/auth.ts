import {
  UPDATE_LOGIN_STEP,
  UPDATE_FIRST_TIME_USER,
  UPDATE_CURRENT_SIGN_UP_STEP,
  UPDATE_ARCANA_AUTH_ADDRESS,
  UPDATE_SIGNUP_STEP,
  UPDATE_ONBOARDING_DATA,
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
  onboardingData: {
    name: string;
    userType: string;
    objective: string[];
    email: string;
  };
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
    }
  | {
      type: typeof UPDATE_ONBOARDING_DATA;
      data: {
        [key: string]: string | number;
      };
    };

const initialState: State = {
  loginStep: 1,
  isFirstTimeUser: undefined,
  currentSignUpStep: 'step0',
  arcanaAuth: {
    address: undefined,
  },
  step: SignupSteps.Welcome,
  onboardingData: {
    name: '',
    userType: '',
    objective: [],
    email: '',
  },
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
    case UPDATE_ONBOARDING_DATA:
      return {
        ...state,
        onboardingData: {
          ...state.onboardingData,
          ...action.data,
        },
      };
    default:
      return { ...state };
  }
};

export default auth;
