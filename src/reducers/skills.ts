import { ISkills } from 'actions/skills';
import { FILL_SKILLS } from 'actions/skills/types';

interface State {
  appSkills: ISkills[];
}

type Action = {
  type: typeof FILL_SKILLS;
  skills: ISkills[];
};

const initialState: State = {
  appSkills: [],
};

const skills = (state = initialState, action: Action): State => {
  switch (action.type) {
    case FILL_SKILLS:
      return {
        ...state,
        appSkills: action.skills,
      };
    default:
      return { ...state };
  }
};

export default skills;
