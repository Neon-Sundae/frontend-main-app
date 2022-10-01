import { SET_WALLETCONNECT_PROVIDER, TOGGLE_WALLET_DRAWER } from './types';

export const setWalletConnectProvider = (provider: any) => ({
  type: SET_WALLETCONNECT_PROVIDER,
  provider,
});

export const toggleWalletDrawer = (toggle: boolean) => ({
  type: TOGGLE_WALLET_DRAWER,
  toggle,
});
