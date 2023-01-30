import {
  ADD_PROFILE_EDUCATION,
  ADD_PROFILE_SKILL,
  ADD_PROFILE_WORKPLACE,
  EDIT_PROFILE,
  FILL_PROFILE_DATA,
  REMOVE_PROFILE_EDUCATION,
  REMOVE_PROFILE_SKILL,
  REMOVE_PROFILE_WORKPLACE,
  UPDATE_PROFILE_DETAILS,
  UPDATE_PROFILE_EDUCATION,
  UPDATE_PROFILE_SOCIALS,
  UPDATE_PROFILE_TIMEZONE,
  UPDATE_PROFILE_WORKPLACE,
  GET_USDC_BALANCE,
  GET_PROFILE_CONTRACT_ADDRESS,
  GET_USER_XP,
  UPDATE_PROFILE_CONTRACT_ADDRESS,
  SET_CURRENT_USER_PROFILE_PICTURE,
} from 'actions/profile/types';
import { ISkills } from 'actions/skills';
import {
  IProfile,
  IProfileApiResponse,
  IProfileCertifications,
  IProfileEducation,
  IProfileSkills,
  IProfileWorkplace,
} from 'interfaces/profile';

interface State {
  profile: IProfile | null;
  certifications: IProfileCertifications[];
  education: IProfileEducation[];
  workplaces: IProfileWorkplace[];
  profileSkills: IProfileSkills[];
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
      type: typeof ADD_PROFILE_SKILL;
      skill: ISkills;
    }
  | {
      type: typeof REMOVE_PROFILE_SKILL;
      skills: ISkills[];
    }
  | {
      type: typeof UPDATE_PROFILE_SOCIALS;
      portfolio: string;
      linkedin: string;
      twitter: string;
      instagram: string;
      github: string;
    }
  | {
      type: typeof UPDATE_PROFILE_TIMEZONE;
      timezone: string;
    }
  | {
      type: typeof ADD_PROFILE_EDUCATION;
      education: IProfileEducation;
    }
  | {
      type: typeof REMOVE_PROFILE_EDUCATION;
      educationId: number;
    }
  | {
      type: typeof UPDATE_PROFILE_EDUCATION;
      educationId: number;
      name: string;
      value: string;
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
      currentUserProfilePicture: string;
    };

const initialState: State = {
  profile: null,
  certifications: [],
  education: [],
  workplaces: [],
  profileSkills: [],
  isEditable: false,
  xp: 0,
  usdcBalance: 0,
  navbarProfile: null,
  currentUserProfilePicture: null,
};

const profile = (state = initialState, action: Action): State => {
  switch (action.type) {
    case FILL_PROFILE_DATA: {
      const { certifications, education, workplaces, profileSkills, ...rest } =
        action.profile;
      return {
        ...state,
        profile: rest,
        certifications,
        education,
        workplaces,
        profileSkills,
        navbarProfile: {
          profileId: rest.profileId,
          image: rest.picture,
        },
      };
    }
    case ADD_PROFILE_SKILL:
      return {
        ...state,
        profileSkills: [...state.profileSkills, action.skill],
      };
    case REMOVE_PROFILE_SKILL:
      return {
        ...state,
        profileSkills: action.skills,
      };
    case EDIT_PROFILE:
      return {
        ...state,
        isEditable: action.isEditable,
      };
    case UPDATE_PROFILE_SOCIALS: {
      const { portfolio, linkedin, twitter, instagram, github } = action;

      if (state.profile) {
        return {
          ...state,
          profile: {
            ...state.profile,
            portfolio,
            linkedin,
            twitter,
            instagram,
            github,
          },
        };
      }
      return { ...state };
    }
    case UPDATE_PROFILE_TIMEZONE:
      if (state.profile) {
        return {
          ...state,
          profile: {
            ...state.profile,
            timezone: action.timezone,
          },
        };
      }
      return { ...state };
    case ADD_PROFILE_EDUCATION:
      return {
        ...state,
        education: [...state.education, action.education],
      };
    case REMOVE_PROFILE_EDUCATION: {
      const newEducationData = state.education.filter(
        x => x.educationId !== action.educationId
      );
      return {
        ...state,
        education: newEducationData,
      };
    }
    case UPDATE_PROFILE_EDUCATION:
      return {
        ...state,
        education: state.education.map(e =>
          e.educationId === action.educationId
            ? {
                ...e,
                [action.name]: action.value,
              }
            : e
        ),
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
