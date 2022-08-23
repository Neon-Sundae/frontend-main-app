import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import getProfileProjects from 'utils/getProfileProjects';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchUserProjects = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const accessToken = getAccessToken();

  const { data, isLoading } = useQuery(
    ['userOrgs'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/user-projects/${user?.userId}`,
        {
          signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await handleApiErrors(response);
      const normalizedProjectData = getProfileProjects(json);
      return normalizedProjectData;
    },
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch off user projects',
        });
      },
    }
  );

  return { flProjects: data ?? [], isLoading };
};
export default useFetchUserProjects;
