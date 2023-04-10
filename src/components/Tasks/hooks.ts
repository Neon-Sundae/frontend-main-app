import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useFetchProfileDetailsByUserWrapper } from 'queries/profile';
import { useFetchUserDetailsWrapper } from 'queries/user';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchUserTasks = () => {
  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsByUserWrapper({
    userId: userData?.user.userId,
  });
  const accessToken = getAccessToken();

  const { data } = useQuery(
    ['userTasks'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/task/user/${profileData?.profileId}`,
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
      enabled: profileData !== null,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch user tasks',
        });
      },
    }
  );

  return { data };
};

export default useFetchUserTasks;
