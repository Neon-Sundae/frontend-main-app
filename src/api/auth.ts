import config from 'config';
import { IUseSaveUserOnboardData, IVerifySignature } from 'interfaces/auth';
import { getAccessToken } from 'utils/authFn';
import { handleAddPolygonChain } from 'utils/ethereumFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import {
  detectMetamask,
  handleSwitchChange,
  requestEthereumAccounts,
} from 'utils/web3EventFn';
import UAuth from '@uauth/js';

const getMetamaskAccountData = async () => {
  const provider = detectMetamask();

  const { errorMessage } = await handleSwitchChange(provider, config.chainId);
  if (errorMessage === 'Chain not present') {
    await handleAddPolygonChain(provider);
  }

  const walletId = await requestEthereumAccounts(provider);

  return { walletId, provider };
};

const metamaskGenerateNonce = async (walletId: string) => {
  const payload = {
    walletId,
  };

  const response = await fetch(
    `${config.ApiBaseUrl}/auth/generate-nonce/sign-up`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  const json = await handleApiErrors(response);
  return json;
};

const arcanaGenereateNonce = async (walletId: string) => {
  const payload = {
    walletId,
  };

  const response = await fetch(
    `${config.ApiBaseUrl}/auth/sign-up/generate-nonce/arcana`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  const json = await handleApiErrors(response);
  return json;
};

const verifySignature = async (payload: IVerifySignature) => {
  const response = await fetch(`${config.ApiBaseUrl}/auth/verify-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const json = await handleApiErrors(response);
  return json;
};

const verifyUdSignature = async () => {
  const uauth = new UAuth({
    clientID: import.meta.env.VITE_UD_CLIENT_KEY,
    redirectUri: config.AppDomain,
    scope: 'openid wallet profile:optional',
  });

  const authorization = await uauth.loginWithPopup();

  if (
    authorization &&
    authorization.idToken &&
    authorization.idToken.wallet_address
  ) {
    const response = await fetch(
      `${config.ApiBaseUrl}/auth/verify-ud-signature/sign-up`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletId: authorization.idToken.wallet_address,
          signature: authorization.idToken.eip4361_signature,
          message: authorization.idToken.eip4361_message,
          nonce: authorization.idToken.nonce,
          domain: authorization.idToken.sub,
          picture: authorization.idToken.picture,
        }),
      }
    );
    const json = await handleApiErrors(response);
    return json;
  }
  return null;
};

const saveUserOnboardData = async (payload: IUseSaveUserOnboardData) => {
  const accessToken = getAccessToken();

  const response = await fetch(`${config.ApiBaseUrl}/user/onboarding-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  await handleApiErrors(response);
};

const saveUserSignupObjectives = async (objectives: string[]) => {
  const accessToken = getAccessToken();

  const payload = {
    objectives,
  };

  const response = await fetch(`${config.ApiBaseUrl}/user/signup-objectives`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  await handleApiErrors(response);
};

const saveOrganisationSignupObjectives = async (objectives: string[]) => {
  const accessToken = getAccessToken();

  const payload = {
    objectives,
  };

  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/signup-objectives`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );
  await handleApiErrors(response);
};

export {
  getMetamaskAccountData,
  metamaskGenerateNonce,
  arcanaGenereateNonce,
  verifySignature,
  verifyUdSignature,
  saveUserOnboardData,
  saveUserSignupObjectives,
  saveOrganisationSignupObjectives,
};
