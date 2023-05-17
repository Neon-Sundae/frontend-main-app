import { AuthProvider, CHAIN } from '@arcana/auth';
import config from 'config';

export const arcanaProvider = new AuthProvider(
  `${import.meta.env.VITE_ARCANA_AUTH_CLIENT_KEY}`,
  {
    chainConfig: {
      chainId: config.chainId as CHAIN,
      rpcUrl: config.rpcURL,
    },
    network: import.meta.env.VITE_ARCANA_NETWORK,
  }
);
