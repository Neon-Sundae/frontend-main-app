import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchOrgJobsByLimit = (organisationId: number, limit: number) => {
  const accessToken = getAccessToken();

  const { data, isLoading } = useQuery(
    ['org_jobs_limit', organisationId],
    async () => {
      const response = await fetch(
        `${config.ApiBaseUrl}/job/organisation/${organisationId}?limit=${limit}`,
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
      staleTime: Infinity,
      retry: 1,
      refetchOnWindowFocus: false,
      // onError: (error: any) => {
      //   handleError({
      //     error,
      //   });
      // },
    }
  );
  return { data, isLoading };
};

export default useFetchOrgJobsByLimit;
