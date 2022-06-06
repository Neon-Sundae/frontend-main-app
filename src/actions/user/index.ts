import { UPDATE_USER } from './types';

export interface IUser {
  userId: number;
  name: string | null;
  walletId: string;
  email: string | null;
  discordId: string | null;
  isFounder: boolean;
  nonce: string;
}

export const updateUser = (user: Partial<IUser>) => ({
  type: UPDATE_USER,
  user,
});
