import { IUser } from 'interfaces/user';
import {
  UPDATE_USER,
  UPDATE_USER_NAME,
  UPDATE_USER_EMAIL,
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

export const updateUserEmail = (email: string) => ({
  type: UPDATE_USER_EMAIL,
  email,
});

export const setUserId = (userId: number) => ({
  type: UPDATE_USER_ID,
  userId,
});
