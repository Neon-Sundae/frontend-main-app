import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useParams } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import getProfileProjects from 'utils/getProfileProjects';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchUserProjects = () => {
  const { profileId } = useParams();
  const accessToken = getAccessToken();

  const { data, isLoading } = useQuery(
    ['userOrgs'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/user-projects/${profileId}`,
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
      enabled: profileId !== undefined,
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
