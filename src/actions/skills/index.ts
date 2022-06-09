import { FILL_SKILLS } from './types';

export interface ISkills {
  skillsId: number;
  name: string;
}

export const fillProfileSkills = (skills: ISkills[]) => ({
  type: FILL_SKILLS,
  skills,
});
