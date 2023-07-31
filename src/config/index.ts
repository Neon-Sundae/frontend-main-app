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
  rpcURL: string;
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
    rpcURL: 'https://rpc-mumbai.maticvigil.com',
    ...localContracts,
  },
  dev: {
    ApiBaseUrl: 'https://ns-server-dev-lswtiyhelq-ue.a.run.app/development',
    AppDomain: 'https://ns-fe-dev-lswtiyhelq-ue.a.run.app/',
    chainId: '0x13881',
    explorerURL: 'https://mumbai.polygonscan.com',
    rpcURL: 'https://rpc-mumbai.maticvigil.com',
    ...devContracts,
  },
  stage: {
    ApiBaseUrl: 'https://api.develop.founderslab.xyz/staging',
    AppDomain: 'https://testnet.founderslab.xyz',
    chainId: '0x13881',
    explorerURL: 'https://mumbai.polygonscan.com',
    rpcURL: 'https://rpc-mumbai.maticvigil.com',
    ...testnetContracts,
  },
  prod: {
    ApiBaseUrl: 'https://api.neonsundae.xyz/production',
    AppDomain: 'https://app.neonsundae.xyz',
    chainId: '0x89',
    explorerURL: 'https://polygonscan.com',
    rpcURL: 'https://polygon-mainnet.infura.io',
    ...mainnetContracts,
  },
};

const environment = import.meta.env.VITE_APPLICATION_ENV;
const config = configs[environment];

export default config;
