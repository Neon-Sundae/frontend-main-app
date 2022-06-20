import { ISkills } from 'actions/skills';
import { IProfileApiResponse, IProfileEducation } from 'interfaces/profile';
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

export interface IUpdateProfileSocial {
  portfolio: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  github: string;
}

export const updateProfileSocialAction = (
  portfolio: string,
  linkedin: string,
  twitter: string,
  instagram: string,
  github: string
) => ({
  type: UPDATE_PROFILE_SOCIALS,
  portfolio,
  linkedin,
  twitter,
  instagram,
  github,
});

export const updateProfileTimezoneAction = (timezone: string) => ({
  type: UPDATE_PROFILE_TIMEZONE,
  timezone,
});

export const addProfileEducationAction = (education: IProfileEducation) => ({
  type: ADD_PROFILE_EDUCATION,
  education,
});

export const removeProfileEducationAction = (educationId: number) => ({
  type: REMOVE_PROFILE_EDUCATION,
  educationId,
});

export const updateProfileEducationAction = (
  educationId: number,
  degree: string,
  university: string,
  startDate: string,
  endDate: string
) => ({
  type: UPDATE_PROFILE_EDUCATION,
  educationId,
  degree,
  university,
  startDate,
  endDate,
});
