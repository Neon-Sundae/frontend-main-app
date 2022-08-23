import { ISkills } from 'actions/skills';
import {
  IProfileApiResponse,
  IProfileEducation,
  IProfileWorkplace,
} from 'interfaces/profile';
import {
  ADD_PROFILE_EDUCATION,
  ADD_PROFILE_SKILL,
  ADD_PROFILE_WORKPLACE,
  EDIT_PROFILE,
  FILL_PROFILE_DATA,
  REMOVE_PROFILE_EDUCATION,
  REMOVE_PROFILE_SKILL,
  REMOVE_PROFILE_WORKPLACE,
  UPDATE_PROFILE_DETAILS,
  UPDATE_PROFILE_EDUCATION,
  UPDATE_PROFILE_SOCIALS,
  UPDATE_PROFILE_TIMEZONE,
  UPDATE_PROFILE_WORKPLACE,
  GET_USER_XP,
  GET_USDC_BALANCE,
} from './types';

export const getXP = (xp: number) => ({
  type: GET_USER_XP,
  payload: xp,
});

export const getUSDCBalance = (usdc: number) => ({
  type: GET_USDC_BALANCE,
  payload: usdc,
});

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

export const updateProfileDetailsAction = (
  title: string,
  description: string,
  picture: string,
  name: string
) => ({
  type: UPDATE_PROFILE_DETAILS,
  title,
  description,
  picture,
  name,
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
  name: string,
  value: string
) => ({
  type: UPDATE_PROFILE_EDUCATION,
  educationId,
  name,
  value,
});

export const addProfileWorkplaceAction = (workplace: IProfileWorkplace) => ({
  type: ADD_PROFILE_WORKPLACE,
  workplace,
});

export const removeProfileWorkplaceAction = (workplaceId: number) => ({
  type: REMOVE_PROFILE_WORKPLACE,
  workplaceId,
});

export const updateProfileWorkplaceAction = (
  workplaceId: number,
  keyName: string,
  value: string
) => ({
  type: UPDATE_PROFILE_WORKPLACE,
  workplaceId,
  keyName,
  value,
});
