import config from 'config';
import { useMutation } from 'react-query';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

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

export default useCreateTask;
