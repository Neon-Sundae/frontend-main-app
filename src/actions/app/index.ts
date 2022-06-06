/* eslint-disable import/prefer-default-export */
import { SET_WALLETCONNECT_PROVIDER } from './types';

export const setWalletConnectProvider = (provider: any) => ({
  type: SET_WALLETCONNECT_PROVIDER,
  provider,
});
