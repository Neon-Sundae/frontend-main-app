import { UPDATE_PROJECT_CATEGORY } from 'actions/flProject/types';

interface State {
  categoryFilter: any | undefined;
}

type Action = {
  type: typeof UPDATE_PROJECT_CATEGORY;
  categories: any;
};

const initialState: State = {
  categoryFilter: undefined,
};

const flProject = (state = initialState, action: Action): State => {
  switch (action.type) {
    case UPDATE_PROJECT_CATEGORY:
      return {
        ...state,
        categoryFilter: action.categories,
      };
    default:
      return { ...state };
  }
};

export default flProject;
