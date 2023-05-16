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

export {
  getMetamaskAccountData,
  metamaskGenerateNonce,
  verifySignature,
  saveUserOnboardData,
};
