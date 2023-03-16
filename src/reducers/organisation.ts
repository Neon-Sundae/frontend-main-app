import {
  EDIT_ORGANISATION,
  HORIZONTAL_BAR_TAB_SELECTED,
} from 'actions/organisation/types';

interface State {
  isEditable: boolean;
  selectedTab: number;
}

type Action =
  | {
      type: typeof EDIT_ORGANISATION;
      isEditable: boolean;
    }
  | {
      type: typeof HORIZONTAL_BAR_TAB_SELECTED;
      selectedTab: number;
    };

const initialState: State = {
  isEditable: false,
  selectedTab: 0,
};

const org = (state = initialState, action: Action): State => {
  switch (action.type) {
    case EDIT_ORGANISATION: {
      return {
        ...state,
        isEditable: action.isEditable,
      };
    }
    case HORIZONTAL_BAR_TAB_SELECTED: {
      return {
        ...state,
        selectedTab: action.selectedTab,
      };
    }
    default:
      return { ...state };
  }
};

export default org;
