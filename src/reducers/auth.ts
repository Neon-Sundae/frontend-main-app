import {
  UPDATE_LOGIN_STEP,
  UPDATE_FIRST_TIME_USER,
  UPDATE_CURRENT_SIGN_UP_STEP,
} from 'actions/auth/types';

interface State {
  loginStep: number;
  currentSignUpStep: string;
  isFirstTimeUser: boolean | undefined;
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
    };

const initialState: State = {
  loginStep: 1,
  isFirstTimeUser: undefined,
  currentSignUpStep: 'step0',
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
    default:
      return { ...state };
  }
};

export default auth;
