import config from 'config';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

interface IApplyToJobPayload {
  jobId_uuid: string;
}

const useApplyToJob = () => {
  const applyToJob = useMutation(
    async (payload: IApplyToJobPayload) => {
      const accessToken = getAccessToken();

      if (accessToken === null) {
        const newWindow = window.open(
          `${config.AppDomain}/login`,
          '_blank',
          'noopener,noreferrer'
        );
        if (newWindow) newWindow.opener = null;
        return;
      }

      const response = await fetch(`${config.ApiBaseUrl}/job/apply`, {
        method: 'POST',
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
      onSuccess: () => {
        toast.success('Successfully Applied');
      },
    }
  );

  return applyToJob;
};

export default useApplyToJob;
