import { ISkills } from 'actions/skills';
import { IProfileApiResponse } from 'interfaces/profile';
import {
  ADD_PROFILE_SKILL,
  FILL_PROFILE_DATA,
  REMOVE_PROFILE_SKILL,
} from './types';

export const fillProfileData = (profile: IProfileApiResponse) => ({
  type: FILL_PROFILE_DATA,
  profile,
});

export const addProfileSkill = (skill: ISkills) => ({
  type: ADD_PROFILE_SKILL,
  skill,
});

export const removeProfileSkill = (skillId: number) => ({
  type: REMOVE_PROFILE_SKILL,
  skillId,
});
