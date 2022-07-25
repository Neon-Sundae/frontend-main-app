import config from 'config';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleError } from 'utils/handleUnAuthorization';
import { handleApiErrors } from 'utils/handleApiErrors';

interface IBuilderTaskApply {
  taskId: number;
}

const useBuilderTaskApply = () => {
  const accessToken = getAccessToken();

  const profile = useSelector((state: RootState) => state.profile.profile);

  const builderTaskApply = useMutation(
    async (payload: IBuilderTaskApply) => {
      const response = await fetch(`${config.ApiBaseUrl}/task/apply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profile?.profileId,
          taskId: payload.taskId,
        }),
      });
      await handleApiErrors(response);
    },
    {
      retry: 1,
      onError: (error: any) => {
        console.log(error);
        handleError({ error });
      },
      onSuccess: () => {
        toast.success('Successfully Applied');
      },
    }
  );

  return builderTaskApply;
};

export default useBuilderTaskApply;
