import {
  UPDATE_LOGIN_STEP,
  UPDATE_FIRST_TIME_USER,
  UPDATE_CURRENT_SIGN_UP_STEP,
  UPDATE_ARCANA_AUTH_ADDRESS,
} from 'actions/auth/types';

interface State {
  loginStep: number;
  currentSignUpStep: string;
  isFirstTimeUser: boolean | undefined;
  arcanaAuth: {
    address: string | undefined;
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
    };

const initialState: State = {
  loginStep: 1,
  isFirstTimeUser: undefined,
  currentSignUpStep: 'step0',
  arcanaAuth: {
    address: undefined,
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
    default:
      return { ...state };
  }
};

export default auth;
