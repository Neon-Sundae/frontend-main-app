import { ISkills } from 'actions/skills';
import { IProfileApiResponse } from 'interfaces/profile';
import {
  ADD_PROFILE_SKILL,
  EDIT_PROFILE,
  FILL_PROFILE_DATA,
  REMOVE_PROFILE_SKILL,
} from './types';

export const fillProfileData = (profile: IProfileApiResponse) => ({
  type: FILL_PROFILE_DATA,
  profile,
});

export const addProfileSkillAction = (skill: ISkills) => ({
  type: ADD_PROFILE_SKILL,
  skill,
});

export const removeProfileSkillAction = (skills: ISkills[]) => ({
  type: REMOVE_PROFILE_SKILL,
  skills,
});

export const editProfile = (isEditable: boolean) => ({
  type: EDIT_PROFILE,
  isEditable,
});
