import { AuthProvider } from '@arcana/auth';
// import config from 'config';

// TODO: remove this empty arcanaProvider

export const arcanaProvider = new AuthProvider(``, {});

// FIXME: arcanaProvider

// export const arcanaProvider = new AuthProvider(
//   `${import.meta.env.VITE_ARCANA_AUTH_CLIENT_KEY}`,
//   {
//     chainConfig: {
//       chainId: '0x13881',
//       rpcUrl: 'https://rpc-mumbai.maticvigil.com',
//     },
//     network: 'testnet',
//   }
// );
