import config from 'config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import formatTasksData from 'utils/formatTasksData';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchProjectTasks = () => {
  const categories = useSelector(
    (state: RootState) => state.flProject.categoryFilter
  );
  const { create } = useParams();
  const { data } = useQuery(
    ['projectTasks', categories],
    async ({ signal }) => {
      const getCategoryQuery = () => {
        if (!categories) return '';

        const filters = Object.keys(categories).filter(k => categories[k]);

        if (filters.length > 0) return `?category=${filters.join(',')}`;
        return '';
      };

      if (create) {
        const response = await fetch(
          `${
            config.ApiBaseUrl
          }/fl-project/${create}/tasks${getCategoryQuery()}`,
          {
            signal,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const json = await handleApiErrors(response);
        const formattedData = formatTasksData(json);

        return formattedData;
      }

      // create is falsy throw error
      throw new Error('error');
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch project tasks',
        });
      },
    }
  );

  return { projectTasks: data };
};

export interface IUpdateTaskStatus {
  taskId: number;
  status: string;
}

const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateTask = useMutation(
    ({ taskId, status }: IUpdateTaskStatus) => {
      const payload = {
        status,
      };

      return fetch(`${config.ApiBaseUrl}/task/status/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['projectTasks']);
      },
    }
  );

  return updateTask;
};

export { useFetchProjectTasks, useUpdateTaskStatus };
