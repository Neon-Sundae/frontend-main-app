interface Configuration {
  ApiBaseUrl: string;
  AppDomain: string;
}

interface Environment {
  [x: string]: Configuration;
}

const configs: Environment = {
  local: {
    ApiBaseUrl: 'http://localhost:3001',
    AppDomain: 'http://localhost:3000',
  },
  dev: {
    ApiBaseUrl: 'http://ec2-52-15-235-7.us-east-2.compute.amazonaws.com',
    AppDomain:
      'http://founderslab-dev-deployment.s3-website.us-east-2.amazonaws.com',
  },
  prod: {
    ApiBaseUrl: '',
    AppDomain: '',
  },
};

const environment = import.meta.env.VITE_APPLICATION_ENV;
const config = configs[environment];

export default config;
