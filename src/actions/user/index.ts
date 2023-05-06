import { IUser } from 'interfaces/user';
import {
  UPDATE_USER,
  UPDATE_USER_NAME,
  UPDATE_USER_EMAIL,
  UPDATE_USER_DISCORD,
  SIGN_UP_STEP,
  UPDATE_USER_ID,
} from './types';

export const updateUser = (user: Partial<IUser>) => ({
  type: UPDATE_USER,
  user,
});

export const updateUserName = (name: string) => ({
  type: UPDATE_USER_NAME,
  name,
});

export const updateUserDiscord = (discordId: string) => ({
  type: UPDATE_USER_DISCORD,
  discordId,
});

export const updateUserEmail = (email: string) => ({
  type: UPDATE_USER_EMAIL,
  email,
});

export const setSignUpStep = (step: number) => ({
  type: SIGN_UP_STEP,
  step,
});

export const setUserId = (userId: number) => ({
  type: UPDATE_USER_ID,
  userId,
});
