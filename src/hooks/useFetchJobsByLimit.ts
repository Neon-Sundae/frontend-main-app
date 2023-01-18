import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useNavigate } from 'react-router-dom';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchJobsByLimit = (limit: number) => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ['all_jobs_limit'],
    async () => {
      const response = await fetch(
        `${config.ApiBaseUrl}/job/all?limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const json = await handleApiErrors(response);
      if (json.length === 0) throw new Error('Not Found');
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
  return { data, isLoading };
};

export default useFetchJobsByLimit;
