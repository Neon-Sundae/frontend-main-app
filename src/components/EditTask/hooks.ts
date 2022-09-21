import { useMutation } from '@tanstack/react-query';
import config from 'config';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import { getAccessToken } from 'utils/authFn';

interface IUpdateTask {
  name: string;
  description: string;
  estimatedDifficulty: number;
  deliveryRepository: string;
  price: number;
  startDate: string;
  dueDate: string;
  // taskAttachment: any;
  taskCheckList: any;
  // flProjectCategory: {
  //   flProjectCategoryId: 9;
  //   categoryName: 'Dev';
  //   percentageAllocation: 50;
  //   percentageUsed: null;
  // };
}

const useUpdateTask = (taskId: number) => {
  const accessToken = getAccessToken();
  const updateTask = useMutation(
    async (payload: IUpdateTask) => {
      const response = await fetch(`${config.ApiBaseUrl}/task/edit/${taskId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      await handleApiErrors(response);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );
  return updateTask;
};

export default useUpdateTask;
