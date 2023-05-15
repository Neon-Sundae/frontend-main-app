import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import { fetchUserDetailsByWallet, updateUserDetails } from 'api/user';
import { IUserApiResponse } from 'interfaces/user';
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
      dispatch(updateFirstTimeUser(!json.userExists));
    },
    onError: (error: any) => {
      handleError({
        error,
        explicitMessage: 'Unable to fetch user data',
      });
    },
  });
};

const useFetchUserDetailsWrapper = (): IUserApiResponse | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(['user-details']);
};

interface IUseUserId {
  userId: number | undefined;
}

interface IUseUpdateUserDetails {
  payload: {
    [key: string]: string | number | undefined;
  };
}

const useUpdateUserDetails = ({ userId }: IUseUserId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload }: IUseUpdateUserDetails) =>
      updateUserDetails({ userId, payload }),
    onSuccess: newDetails => {
      queryClient.setQueryData(
        ['user-details'],
        (old: IUserApiResponse | undefined) => {
          if (old) {
            return {
              ...old,
              user: {
                ...old.user,
                ...newDetails,
              },
            };
          }
          return newDetails;
        }
      );
    },
  });
};

export {
  useFetchUserDetailsByWallet,
  useFetchUserDetailsWrapper,
  useUpdateUserDetails,
};
