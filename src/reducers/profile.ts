import {
  EDIT_PROFILE,
  GET_USDC_BALANCE,
  GET_PROFILE_CONTRACT_ADDRESS,
  GET_USER_XP,
  SET_CURRENT_USER_PROFILE_PICTURE,
} from 'actions/profile/types';

interface State {
  isEditable: boolean;
  xp: number;
  usdcBalance: number;
  currentUserProfilePicture: string | null;
}

type Action =
  | {
      type: typeof EDIT_PROFILE;
      isEditable: boolean;
    }
  | {
      type: typeof GET_USER_XP;
      payload: number;
    }
  | {
      type: typeof GET_USDC_BALANCE;
      payload: number;
    }
  | {
      type: typeof SET_CURRENT_USER_PROFILE_PICTURE;
      currentUserProfilePicture: string | null;
    };

const initialState: State = {
  isEditable: false,
  xp: 0,
  usdcBalance: 0,
  currentUserProfilePicture: null,
};

const profile = (state = initialState, action: Action): State => {
  switch (action.type) {
    case EDIT_PROFILE:
      return {
        ...state,
        isEditable: action.isEditable,
      };
    case GET_USER_XP:
      return {
        ...state,
        xp: action.payload,
      };
    case GET_USDC_BALANCE:
      return {
        ...state,
        usdcBalance: action.payload,
      };
    case SET_CURRENT_USER_PROFILE_PICTURE:
      return {
        ...state,
        currentUserProfilePicture: action.currentUserProfilePicture,
      };
    default:
      return { ...state };
  }
};

export default profile;
