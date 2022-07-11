import { UPDATE_PROJECT_CATEGORY, GET_SELECTED_PROJECT_ADDRESS } from 'actions/flProject/types';

interface State {
  categoryFilter: any | undefined,
  selectedProjectAddress: string
}

type Action =
  | {
    type: typeof UPDATE_PROJECT_CATEGORY;
    categories: any;
  }
  | {
    type: typeof GET_SELECTED_PROJECT_ADDRESS;
    payload: string;
  };

const initialState: State = {
  categoryFilter: undefined,
  selectedProjectAddress: ''
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
    default:
      return { ...state };
  }
};

export default flProject;
