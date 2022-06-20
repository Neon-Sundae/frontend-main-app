import {
  ADD_PROFILE_EDUCATION,
  ADD_PROFILE_SKILL,
  EDIT_PROFILE,
  FILL_PROFILE_DATA,
  REMOVE_PROFILE_EDUCATION,
  REMOVE_PROFILE_SKILL,
  UPDATE_PROFILE_EDUCATION,
  UPDATE_PROFILE_SOCIALS,
  UPDATE_PROFILE_TIMEZONE,
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
      degree: string;
      university: string;
      startDate: string;
      endDate: string;
    };

const initialState: State = {
  profile: null,
  certifications: [],
  education: [],
  workplaces: [],
  profileSkills: [],
  isEditable: false,
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
                degree: action.degree,
                university: action.university,
                startDate: action.startDate,
                endDate: action.endDate,
              }
            : e
        ),
      };
    default:
      return { ...state };
  }
};

export default profile;
