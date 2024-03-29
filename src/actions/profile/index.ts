import { EDIT_PROFILE, GET_USER_XP, GET_USDC_BALANCE } from './types';

export const getXP = (xp: number) => ({
  type: GET_USER_XP,
  payload: xp,
});

export const getUSDCBalance = (usdc: number) => ({
  type: GET_USDC_BALANCE,
  payload: usdc,
});

export const editProfile = (isEditable: boolean) => ({
  type: EDIT_PROFILE,
  isEditable,
});
