import { INormalizeSkills } from 'interfaces/skills';
import {
  ADD_PROFILE_NORMALIZE_SKILL,
  FILL_PROFILE_SKILLS,
  FILL_SKILLS,
} from 'actions/skills/types';

interface State {
  appSkills: INormalizeSkills[];
  profileSkills: INormalizeSkills[];
}

type Action =
  | {
      type: typeof FILL_SKILLS;
      skills: INormalizeSkills[];
    }
  | {
      type: typeof FILL_PROFILE_SKILLS;
      skills: INormalizeSkills[];
    }
  | {
      type: typeof ADD_PROFILE_NORMALIZE_SKILL;
      skill: INormalizeSkills;
    };

const initialState: State = {
  appSkills: [],
  profileSkills: [],
};

const skills = (state = initialState, action: Action): State => {
  switch (action.type) {
    case FILL_SKILLS:
      return {
        ...state,
        appSkills: action.skills,
      };
    case FILL_PROFILE_SKILLS:
      return {
        ...state,
        profileSkills: action.skills,
      };
    case ADD_PROFILE_NORMALIZE_SKILL:
      return {
        ...state,
        profileSkills: [...state.profileSkills, action.skill],
      };
    default:
      return { ...state };
  }
};

export default skills;
