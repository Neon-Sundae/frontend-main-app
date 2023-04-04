import { useQuery } from '@tanstack/react-query';
import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import { fetchUserDetailsByWallet } from 'api/user';
import { useDispatch } from 'react-redux';
import { getAccessToken } from 'utils/authFn';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchUserDetailsByWallet = () => {
  const accessToken = getAccessToken();
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['user-details'],
    queryFn: fetchUserDetailsByWallet,
    enabled: !!accessToken,
    onSuccess: json => {
      dispatch(updateUser(json.user));
      dispatch(updateFirstTimeUser(json.userExists));
    },
    onError: (error: any) => {
      handleError({
        error,
        explicitMessage: 'Unable to fetch user data',
      });
    },
  });
};

export { useFetchUserDetailsByWallet };
