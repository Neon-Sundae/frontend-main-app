import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import config from 'config';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAccessToken } from 'utils/authFn';
import decodeToken from 'utils/decodeToken';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleUnAuthorization } from 'utils/handleUnAuthorization';

const useGetUserByWalletId = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const decoded = decodeToken(accessToken);

      if (decoded) {
        const ac = new AbortController();
        const { signal } = ac;

        (async () => {
          try {
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
          } catch (err) {
            console.log(err);
            handleUnAuthorization(err);
          }
        })();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useGetUserByWalletId;
