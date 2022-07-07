import config from 'config';
import { Query, useMutation, useQuery, useQueryClient } from 'react-query';
import formatTasksData from 'utils/formatTasksData';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchProjectTasks = () => {
  const { data } = useQuery(
    'projectTasks',
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/${1}/tasks`,
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

interface IUpdateTaskStatus {
  taskId: number;
  status: string;
}

const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  const updateTask = useMutation(
    ({ taskId, status }: IUpdateTaskStatus) => {
      const payload = {
        status,
      };

      return fetch(`${config.ApiBaseUrl}/task/status/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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
        queryClient.invalidateQueries('projectTasks');
      },
    }
  );

  return updateTask;
};

export { useFetchProjectTasks, useUpdateTaskStatus };
