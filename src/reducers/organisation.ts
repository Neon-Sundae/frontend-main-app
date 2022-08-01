import { EDIT_ORGANISATION } from 'actions/organisation/types';

interface State {
  isEditable: boolean;
}

type Action = {
  type: typeof EDIT_ORGANISATION;
  isEditable: boolean;
};

const initialState: State = {
  isEditable: false,
};

const org = (state = initialState, action: Action): State => {
  switch (action.type) {
    case EDIT_ORGANISATION: {
      return {
        ...state,
        isEditable: action.isEditable,
      };
    }
    default:
      return { ...state };
  }
};

export default org;
