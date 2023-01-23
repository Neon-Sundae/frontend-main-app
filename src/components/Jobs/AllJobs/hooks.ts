/* eslint-disable camelcase */
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useNavigate } from 'react-router-dom';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchJobs = (organisationId: string | null) => {
  const navigate = useNavigate();

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
      if (json.length === 0) throw new Error('Not Found');
      return json;
    },
    {
      staleTime: Infinity,
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        if (error.message === 'Not Found') {
          navigate('/404');
        }

        // handleError({
        //   error,
        // });
      },
    }
  );
  return data;
};

const useFetchJobDetail = (jobId_uuid: string | null) => {
  const navigate = useNavigate();

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
        if (error.message === 'Not Found') {
          navigate('/404');
        }

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
