import {
  ADD_PROFILE_SKILL,
  EDIT_PROFILE,
  FILL_PROFILE_DATA,
  REMOVE_PROFILE_SKILL,
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
    default:
      return { ...state };
  }
};

export default profile;
