import { Dispatch, SetStateAction } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import config from 'config';
import { handleError } from 'utils/handleUnAuthorization';
import { getAccessToken } from 'utils/authFn';
import toast from 'react-hot-toast';

const useUpdateTask = (
  taskId: number,
  setOpen: Dispatch<SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateTask = useMutation(
    (formData: FormData) =>
      fetch(`${config.ApiBaseUrl}/task/edit/${taskId}`, {
        method: 'PATCH',
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
        toast.success('Successfully Updated Task');
        queryClient.invalidateQueries(['projectTasks']);
        setOpen(false);
      },
    }
  );
  return updateTask;
};

export default useUpdateTask;
