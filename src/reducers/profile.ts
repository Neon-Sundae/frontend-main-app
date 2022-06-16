import { EDIT_PROFILE, FILL_PROFILE_DATA } from 'actions/profile/types';
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
