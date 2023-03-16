import { AuthProvider, CHAIN } from '@arcana/auth';
import {
  localContracts,
  devContracts,
  testnetContracts,
  mainnetContracts,
} from './contracts';

interface Configuration {
  ApiBaseUrl: string;
  AppDomain: string;
  chainId: string;
  explorerURL: string;
  profileImplementationAddress: string;
  profileFactoryAddress: string;
  projectImplementationAddress: string;
  projectFactoryAddress: string;
  taskImplementationAddress: string;
  taskFactoryAddress: string;
  USDCAddress: string;
  FNDRAddress: string;
}

interface Environment {
  [x: string]: Configuration;
}

/**
 * Chain IDs
 * 0x61 (for binance chain)
 * 0x13881 for Mumbai testnet
 * 0x89 for Polygon
 *
 * Explorer URLs
 * https://mumbai.polygonscan.com/
 * https://polygonscan.com
 */

const configs: Environment = {
  local: {
    ApiBaseUrl: 'http://localhost:3001/local',
    AppDomain: 'http://localhost:3000',
    chainId: '0x13881',
    explorerURL: 'https://mumbai.polygonscan.com',
    ...localContracts,
  },
  dev: {
    ApiBaseUrl: 'https://api.develop.founderslab.xyz/development',
    AppDomain: 'https://develop.founderslab.xyz',
    chainId: '0x13881',
    explorerURL: 'https://mumbai.polygonscan.com',
    ...devContracts,
  },
  stage: {
    ApiBaseUrl: 'https://api.develop.founderslab.xyz/staging',
    AppDomain: 'https://testnet.founderslab.xyz',
    chainId: '0x13881',
    explorerURL: 'https://mumbai.polygonscan.com',
    ...testnetContracts,
  },
  prod: {
    ApiBaseUrl: 'https://api.neonsundae.xyz/production',
    AppDomain: 'https://app.neonsundae.xyz',
    chainId: '0x89',
    explorerURL: 'https://polygonscan.com',
    ...mainnetContracts,
  },
};

const environment = import.meta.env.VITE_APPLICATION_ENV;
const config = configs[environment];
export const provider = new AuthProvider(
  `${import.meta.env.VITE_ARCANA_AUTH_CLIENT_KEY}`,
  {
    chainConfig: {
      chainId: config.chainId as CHAIN,
      rpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
    },
    alwaysVisible: false,
  }
);

export default config;
