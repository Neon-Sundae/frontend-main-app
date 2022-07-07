import config from 'config';
import { useMutation, useQuery } from 'react-query';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import normalizeCategories from 'utils/normalizeCategories';

const useCreateTask = () => {
  const createTask = useMutation(
    (formData: FormData) =>
      fetch(`${config.ApiBaseUrl}/task`, {
        method: 'POST',
        body: formData,
      }),
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return createTask;
};

const useFetchProjectCategories = () => {
  const { data } = useQuery(
    'projectCategory',
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/category/${1}`,
        {
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const json = await handleApiErrors(response);
      const normalizedCategories = normalizeCategories(json);
      return normalizedCategories;
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({ error, explicitMessage: 'Unable to fetch categories' });
      },
    }
  );

  return { categories: data };
};

export { useCreateTask, useFetchProjectCategories };
