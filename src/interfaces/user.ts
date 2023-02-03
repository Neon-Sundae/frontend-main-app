export interface IUser {
  userId: number;
  name: string | null;
  walletId: string;
  email: string | null;
  discordId: string | null;
  isFounder: boolean;
  nonce: string;
  authentication_method: string;
  domain: string | null;
}

export interface IUpdateUser {
  userId: number;
  discordId: string;
}
