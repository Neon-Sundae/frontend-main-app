import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';

const useFetchAllOrgJobs = (organisationId: number) => {
  const accessToken = getAccessToken();

  const { data, isLoading, refetch } = useQuery(
    ['org_jobs_limit', organisationId],
    async () => {
      const response = await fetch(
        `${config.ApiBaseUrl}/job/organisation/${organisationId}`,
        {
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
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
  return { data, isLoading, refetch };
};

export default useFetchAllOrgJobs;
