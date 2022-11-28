/* eslint-disable camelcase */
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchJobs = (organisationId: string | null) => {
  const { data } = useQuery(
    ['all_jobs'],
    async () => {
      let url;
      if (organisationId) {
        url = `${config.ApiBaseUrl}/job/all?organisation=${organisationId}`;
      } else {
        url = `${config.ApiBaseUrl}/job/all`;
      }
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await handleApiErrors(response);
      return json;
    },
    {
      staleTime: Infinity,
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch jobs',
        });
      },
    }
  );
  return data;
};

const useFetchJobDetail = (jobId_uuid: string | null) => {
  const { data, isLoading } = useQuery(
    [jobId_uuid],
    async () => {
      const response = await fetch(`${config.ApiBaseUrl}/job/${jobId_uuid}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await handleApiErrors(response);
      return json;
    },
    {
      enabled: jobId_uuid !== null,
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch job details',
        });
      },
    }
  );
  return { data, isLoading };
};

export { useFetchJobs, useFetchJobDetail };
