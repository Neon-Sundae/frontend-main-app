import { useQuery } from '@tanstack/react-query';
import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import config from 'config';
import { useDispatch } from 'react-redux';
import { getAccessToken } from 'utils/authFn';
import decodeToken from 'utils/decodeToken';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useGetUserByWalletId = () => {
  const dispatch = useDispatch();
  const accessToken = getAccessToken();

  const { data } = useQuery(
    ['fetchUser'],
    async ({ signal }) => {
      const decoded = decodeToken(accessToken);
      const payload = {
        walletId: decoded.walletId,
      };

      const response = await fetch(`${config.ApiBaseUrl}/user/walletId`, {
        signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const json: any = await handleApiErrors(response);
      dispatch(updateUser(json.user));
      dispatch(updateFirstTimeUser(json.userExists));

      return json;
    },
    {
      retry: 1,
      enabled: !!accessToken,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch user data',
        });
      },
    }
  );

  return { data };
};

export default useGetUserByWalletId;
