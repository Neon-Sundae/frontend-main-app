import {
  ADD_PROFILE_WORKPLACE,
  EDIT_PROFILE,
  FILL_PROFILE_DATA,
  REMOVE_PROFILE_WORKPLACE,
  UPDATE_PROFILE_DETAILS,
  UPDATE_PROFILE_WORKPLACE,
  GET_USDC_BALANCE,
  GET_PROFILE_CONTRACT_ADDRESS,
  GET_USER_XP,
  UPDATE_PROFILE_CONTRACT_ADDRESS,
  SET_CURRENT_USER_PROFILE_PICTURE,
} from 'actions/profile/types';
import {
  IProfile,
  IProfileApiResponse,
  IProfileCertifications,
  IProfileEducation,
  IProfileWorkplace,
} from 'interfaces/profile';

interface State {
  profile: IProfile | null;
  certifications: IProfileCertifications[];
  education: IProfileEducation[];
  workplaces: IProfileWorkplace[];
  isEditable: boolean;
  xp: number;
  usdcBalance: number;
  currentUserProfilePicture: string | null;
  navbarProfile: {
    profileId: number;
    image: string | null;
  } | null;
}

type Action =
  | {
      type: typeof FILL_PROFILE_DATA;
      profile: IProfileApiResponse;
    }
  | {
      type: typeof EDIT_PROFILE;
      isEditable: boolean;
    }
  | {
      type: typeof ADD_PROFILE_WORKPLACE;
      workplace: IProfileWorkplace;
    }
  | {
      type: typeof REMOVE_PROFILE_WORKPLACE;
      workplaceId: number;
    }
  | {
      type: typeof UPDATE_PROFILE_WORKPLACE;
      workplaceId: number;
      keyName: string;
      value: string;
    }
  | {
      type: typeof UPDATE_PROFILE_DETAILS;
      title: string;
      description: string;
      picture: string;
      name: string;
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
      type: typeof GET_PROFILE_CONTRACT_ADDRESS;
      payload: string;
    }
  | {
      type: typeof UPDATE_PROFILE_CONTRACT_ADDRESS;
      address: string;
    }
  | {
      type: typeof SET_CURRENT_USER_PROFILE_PICTURE;
      currentUserProfilePicture: string | null;
    };

const initialState: State = {
  profile: null,
  certifications: [],
  education: [],
  workplaces: [],
  isEditable: false,
  xp: 0,
  usdcBalance: 0,
  navbarProfile: null,
  currentUserProfilePicture: null,
};

const profile = (state = initialState, action: Action): State => {
  switch (action.type) {
    case FILL_PROFILE_DATA: {
      const { workplaces, ...rest } = action.profile;
      return {
        ...state,
        profile: rest,
        workplaces,
        navbarProfile: {
          profileId: rest.profileId,
          image: rest.picture,
        },
      };
    }
    case EDIT_PROFILE:
      return {
        ...state,
        isEditable: action.isEditable,
      };
    case ADD_PROFILE_WORKPLACE:
      return {
        ...state,
        workplaces: [...state.workplaces, action.workplace],
      };
    case REMOVE_PROFILE_WORKPLACE: {
      const newWorkplaceData = state.workplaces.filter(
        x => x.workplaceId !== action.workplaceId
      );
      return {
        ...state,
        workplaces: newWorkplaceData,
      };
    }
    case UPDATE_PROFILE_WORKPLACE:
      return {
        ...state,
        workplaces: state.workplaces.map(w =>
          w.workplaceId === action.workplaceId
            ? {
                ...w,
                [action.keyName]: action.value,
              }
            : w
        ),
      };
    case UPDATE_PROFILE_DETAILS:
      if (state.profile) {
        return {
          ...state,
          profile: {
            ...state.profile,
            title: action.title,
            description: action.description,
            picture: action.picture,
            user: {
              name: action.name,
            },
          },
        };
      }
      return { ...state };
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
    case UPDATE_PROFILE_CONTRACT_ADDRESS:
      if (state.profile) {
        return {
          ...state,
          profile: {
            ...state.profile,
            profileSmartContractId: action.address,
          },
        };
      }
      return { ...state };
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
