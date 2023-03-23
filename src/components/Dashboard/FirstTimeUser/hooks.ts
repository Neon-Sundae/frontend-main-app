import { useMutation } from '@tanstack/react-query';
import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import config from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleError } from 'utils/handleUnAuthorization';
import { getItem } from 'utils/sessionStorageFunc';

interface ICreateProfile {
  name: string;
  email: string;
}

const useCreateProfile = (
  setNewUserId?: React.Dispatch<React.SetStateAction<number>>
) => {
  const navigate = useNavigate();
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
        if (setNewUserId) setNewUserId(body.userId);
        dispatch(updateUser(body));
        dispatch(updateFirstTimeUser(false));
        if (!getItem('orgData')) navigate('/dashboard');
      },
    }
  );

  return createProfile;
};

export default useCreateProfile;
