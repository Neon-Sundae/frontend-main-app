import { useMutation } from '@tanstack/react-query';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

interface ICancelTaskByBuilder {
  identifier: string;
}

const useCancelTaskByBuilder = (
  setResponseState: Dispatch<SetStateAction<string>>
) => {
  const cancelTaskByBuilder = useMutation(
    async (payload: ICancelTaskByBuilder) => {
      const response = await fetch(`${config.ApiBaseUrl}/task/cancel/builder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      await handleApiErrors(response);
    },
    {
      retry: 1,
      onError: (error: any) => {
        setResponseState('failed');
        handleError({ error });
      },
      onSuccess: () => {
        setResponseState('success');
      },
    }
  );

  return cancelTaskByBuilder;
};

export default useCancelTaskByBuilder;
