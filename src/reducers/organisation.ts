import {
  EDIT_ORGANISATION,
  HORIZONTAL_BAR_TAB_SELECTED,
  SET_PUBLIC_VIEW,
} from 'actions/organisation/types';

interface State {
  isEditable: boolean;
  selectedTab: number;
  publicView: boolean;
}

type Action =
  | {
      type: typeof EDIT_ORGANISATION;
      isEditable: boolean;
    }
  | {
      type: typeof HORIZONTAL_BAR_TAB_SELECTED;
      selectedTab: number;
    }
  | {
      type: typeof SET_PUBLIC_VIEW;
      publicView: boolean;
    };

const initialState: State = {
  isEditable: false,
  selectedTab: 0,
  publicView: false,
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
    case SET_PUBLIC_VIEW: {
      return {
        ...state,
        publicView: action.publicView,
      };
    }
    default:
      return { ...state };
  }
};

export default org;
