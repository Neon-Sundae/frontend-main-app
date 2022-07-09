import { updateProjectCategory } from 'actions/flProject';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import normalizeCategories from 'utils/normalizeCategories';

const useCreateTask = (setOpen: Dispatch<SetStateAction<boolean>>) => {
  const queryClient = useQueryClient();

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
        setOpen(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries('projectTasks');
        setOpen(false);
      },
    }
  );

  return createTask;
};

const useFetchProjectCategories = () => {
  const dispatch = useDispatch();

  const getFormattedCategories = (categories: any[]) => {
    return categories?.reduce((acc, c) => ({ ...acc, [c.label]: false }), {});
  };

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
      dispatch(
        updateProjectCategory(getFormattedCategories(normalizedCategories))
      );
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
