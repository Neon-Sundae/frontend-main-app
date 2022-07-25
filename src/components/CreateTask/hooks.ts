import { updateProjectCategory } from 'actions/flProject';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import normalizeCategories from 'utils/normalizeCategories';

const useCreateTask = (setOpen: Dispatch<SetStateAction<boolean>>) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const createTask = useMutation(
    (formData: FormData) =>
      fetch(`${config.ApiBaseUrl}/task`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }),
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
        setOpen(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['projectTasks']);
        setOpen(false);
      },
    }
  );

  return createTask;
};

const useFetchProjectCategories = () => {
  const dispatch = useDispatch();
  const { create } = useParams();

  const getFormattedCategories = (categories: any[]) => {
    return categories?.reduce((acc, c) => ({ ...acc, [c.label]: false }), {});
  };

  const { data } = useQuery(
    ['projectCategory'],
    async ({ signal }) => {
      if (create) {
        const response = await fetch(
          `${config.ApiBaseUrl}/fl-project/category/${create}`,
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
      }

      // create is falsy so throw error
      throw new Error('Error');
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
