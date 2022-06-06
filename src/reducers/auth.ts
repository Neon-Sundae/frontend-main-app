import {
  UPDATE_CURRENT_STEP,
  UPDATE_FIRST_TIME_USER,
} from 'actions/auth/types';

interface State {
  currentStep: number;
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
    };

const initialState: State = {
  currentStep: 1,
  isFirstTimeUser: undefined,
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
    default:
      return { ...state };
  }
};

export default auth;
