import { IUser } from 'interfaces/user';
import { UPDATE_USER, UPDATE_USER_NAME, UPDATE_USER_EMAIL } from './types';

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
