import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { handleUnAuthorization } from 'utils/handleUnAuthorization';
import { handleApiErrors } from 'utils/handleApiErrors';
import { updateUserEmail } from 'actions/user';
import { useDispatch } from 'react-redux';

interface IUpdateProfileDetailsParameters {
  userId: number | undefined;
  email: string;
}

const useUpdateUserProfileEmail = () => {
  const dispatch = useDispatch();
  const updateUserProfileEmail = ({
    userId,
    email,
  }: IUpdateProfileDetailsParameters) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            email,
          };
          const response = await fetch(`${config.ApiBaseUrl}/user/${userId}`, {
            signal,
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          });
          await handleApiErrors(response);
          dispatch(updateUserEmail(email));
        } catch (err) {
          console.log('err', err);
          handleUnAuthorization(err);
        }
      })();
    }
  };
  return updateUserProfileEmail;
};

export default useUpdateUserProfileEmail;
