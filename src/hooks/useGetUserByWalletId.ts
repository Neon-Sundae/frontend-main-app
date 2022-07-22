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

// const useGetUserByWalletId = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const accessToken = getAccessToken();

//     if (accessToken) {
//       const decoded = decodeToken(accessToken);

//       if (decoded) {
//         const ac = new AbortController();
//         const { signal } = ac;

//         (async () => {
//           try {
//             const payload = {
//               walletId: decoded.walletId,
//             };

//             const response = await fetch(`${config.ApiBaseUrl}/user/walletId`, {
//               signal,
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${accessToken}`,
//               },
//               body: JSON.stringify(payload),
//             });

//             const json: any = await handleApiErrors(response);
//             dispatch(updateUser(json.user));
//             dispatch(updateFirstTimeUser(json.userExists));
//           } catch (err) {
//             console.log(err);
//             handleUnAuthorization(err);
//           }
//         })();
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
// };

export default useGetUserByWalletId;
