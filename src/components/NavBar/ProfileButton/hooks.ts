import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { handleError } from 'utils/handleUnAuthorization';
import { handleApiErrors } from 'utils/handleApiErrors';
import { updateUserEmail } from 'actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { RootState } from 'reducers';

interface IUpdateProfileDetailsParameters {
  email: string;
}

const useUpdateUserProfileEmail = () => {
  const dispatch = useDispatch();
  const accessToken = getAccessToken();
  const user = useSelector((state: RootState) => state.user.user);
  const updateProfileEmail = useMutation(
    async (payload: IUpdateProfileDetailsParameters) => {
      console.log(payload);
      const response = await fetch(
        `${config.ApiBaseUrl}/user/${user && user.userId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
      dispatch(updateUserEmail(payload.email));
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return updateProfileEmail;
};

export default useUpdateUserProfileEmail;
