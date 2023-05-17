import config from 'config';
import { IUserApiResponse } from 'interfaces/user';
import { getAccessToken } from 'utils/authFn';
import decodeToken from 'utils/decodeToken';
import { handleApiErrors } from 'utils/handleApiErrors';

const fetchUserDetailsByWallet = async () => {
  const accessToken = getAccessToken();
  const decoded = decodeToken(accessToken);
  const payload = {
    walletId: decoded.walletId,
  };

  const response = await fetch(`${config.ApiBaseUrl}/user/walletId`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const json: IUserApiResponse = await handleApiErrors(response);
  return json;
};

interface IUpdateUserDetails {
  userId: number | undefined;
  payload: {
    [key: string]: string | number | undefined;
  };
}

const updateUserDetails = async ({ userId, payload }: IUpdateUserDetails) => {
  const accessToken = getAccessToken();

  const response = await fetch(`${config.ApiBaseUrl}/user/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const json: IUserApiResponse = await handleApiErrors(response);
  return json;
};

export { fetchUserDetailsByWallet, updateUserDetails };
