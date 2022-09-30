interface Configuration {
  ApiBaseUrl: string;
  AppDomain: string;
  chainId: string;
  explorerURL: string;
}

interface Environment {
  [x: string]: Configuration;
}

const configs: Environment = {
  local: {
    ApiBaseUrl: 'http://localhost:3001',
    AppDomain: 'http://localhost:3000',
    chainId: '0x61', //0x61 (for binance chain) 0x13881 for Mumbai testnet
    explorerURL: 'https://testnet.bscscan.com', //https://mumbai.polygonscan.com/
  },
  dev: {
    ApiBaseUrl: 'https://api.develop.founderslab.xyz/development',
    AppDomain: 'https://develop.founderslab.xyz',
    chainId: '0x61',
    explorerURL: 'https://testnet.bscscan.com',
  },
  stage: {
    ApiBaseUrl: 'https://api.develop.founderslab.xyz/staging',
    AppDomain: 'https://testnet.founderslab.xyz',
    chainId: '0x61',
    explorerURL: 'https://testnet.bscscan.com',
  },
  prod: {
    ApiBaseUrl: '',
    AppDomain: '',
    chainId: '0x89',
    explorerURL: 'https://polygonscan.com',
  },
};

const environment = import.meta.env.VITE_APPLICATION_ENV;
const config = configs[environment];

export default config;
