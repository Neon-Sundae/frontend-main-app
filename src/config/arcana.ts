import { AuthProvider } from '@arcana/auth';
import config from 'config';

export const arcanaProvider = new AuthProvider(
  `${import.meta.env.VITE_ARCANA_AUTH_CLIENT_KEY}`,
  {
    chainConfig: {
      chainId: config?.chainId,
      rpcUrl: config?.rpcURL,
    },
    network: import.meta.env.VITE_ARCANA_NETWORK,
  }
);
