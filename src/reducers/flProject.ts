import {
  UPDATE_PROJECT_CATEGORY,
  GET_SELECTED_PROJECT_ADDRESS,
  IS_DEPOSITED,
  GET_DEPLOY_STATE,
  GET_PROJECT_FOUNDER
} from 'actions/flProject/types';

interface State {
  categoryFilter: any | undefined,
  selectedProjectAddress: string,
  isDeposit: boolean,
  deploy_state: string;
  founder: string;
}

type Action =
  | {
    type: typeof UPDATE_PROJECT_CATEGORY;
    categories: any;
  }
  | {
    type: typeof GET_SELECTED_PROJECT_ADDRESS;
    payload: string;
  }
  | {
    type: typeof IS_DEPOSITED;
    payload: boolean;
  }
  | {
    type: typeof GET_DEPLOY_STATE;
    payload: string;
  }
  | {
    type: typeof GET_PROJECT_FOUNDER;
    payload: string;
  };

const initialState: State = {
  categoryFilter: undefined,
  selectedProjectAddress: '',
  isDeposit: false,
  deploy_state: 'go_live',
  founder: ''
};

const flProject = (state = initialState, action: Action): State => {
  switch (action.type) {
    case UPDATE_PROJECT_CATEGORY:
      return {
        ...state,
        categoryFilter: action.categories,
      };
    case GET_SELECTED_PROJECT_ADDRESS:
      return {
        ...state,
        selectedProjectAddress: action.payload
      }
    case IS_DEPOSITED:
      return {
        ...state,
        isDeposit: action.payload
      }
    case GET_DEPLOY_STATE:
      return {
        ...state,
        deploy_state: action.payload
      }
    case GET_PROJECT_FOUNDER:
      return {
        ...state,
        founder: action.payload
      }
    default:
      return { ...state };
  }
};

export default flProject;
