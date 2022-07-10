interface Configuration {
  ApiBaseUrl: string;
  AppDomain: string;
  chainId: string;
}

interface Environment {
  [x: string]: Configuration;
}

const configs: Environment = {
  local: {
    ApiBaseUrl: 'http://localhost:3001',
    AppDomain: 'http://localhost:3000',
    chainId: '0x13881',
  },
  dev: {
    ApiBaseUrl: 'https://api.develop.founderslab.xyz',
    AppDomain: 'https://develop.founderslab.xyz',
    chainId: '0x13881',
  },
  prod: {
    ApiBaseUrl: '',
    AppDomain: '',
    chainId: '0x89',
  },
};

const environment = import.meta.env.VITE_APPLICATION_ENV;
const config = configs[environment];

export default config;
