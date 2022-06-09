import { FILL_PROFILE_DATA } from 'actions/profile/types';
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
}

type Action = {
  type: typeof FILL_PROFILE_DATA;
  profile: IProfileApiResponse;
};

const initialState: State = {
  profile: null,
  certifications: [],
  education: [],
  workplaces: [],
  profileSkills: [],
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
    default:
      return { ...state };
  }
};

export default profile;
