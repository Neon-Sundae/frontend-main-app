import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchUserTasks = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const accessToken = getAccessToken();

  const { data } = useQuery(
    ['userTasks'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/task/user/${profile?.profileId}`,
        {
          signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await handleApiErrors(response);
      return json;
    },
    {
      enabled: profile !== null,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
        });
      },
    }
  );

  return { data };
};

export default useFetchUserTasks;
