import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import config from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import {
  handleError,
  handleUnAuthorization,
} from 'utils/handleUnAuthorization';

interface ICreateProfile {
  name: string;
  email: string;
}

const useCreateProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const createProfile = useMutation(
    (payload: ICreateProfile) => {
      const accessToken = getAccessToken();
      return fetch(`${config.ApiBaseUrl}/user/first-time/${user?.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: async res => {
        const body = await res.json();
        dispatch(updateUser(body));
        dispatch(updateFirstTimeUser(false));
      },
    }
  );

  return createProfile;
};

// const useCreateProfile = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state: RootState) => state.user.user);

//   const createProfile = ({ name, email }: ICreateProfile) => {
//     console.log('user << inside', user);
//     console.log('in createProfile', name, email);
//     const accessToken = getAccessToken();
//     console.log('accessToken', accessToken);
//     if (accessToken) {
//       const ac = new AbortController();
//       const { signal } = ac;

//       (async () => {
//         try {
//           const payload = {
//             name,
//             email,
//           };

//           const response = await fetch(
//             `${config.ApiBaseUrl}/user/first-time/${user?.userId}`,
//             {
//               signal,
//               method: 'PATCH',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${accessToken}`,
//               },
//               body: JSON.stringify(payload),
//             }
//           );

//           const json: any = await handleApiErrors(response);
//         } catch (err) {
//           console.log(err);
//           handleUnAuthorization(err);
//         }
//       })();
//     }
//   };

//   return createProfile;
// };

export default useCreateProfile;
