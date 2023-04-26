import config from 'config';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import { handleError } from 'utils/handleUnAuthorization';
import { handleApiErrors } from 'utils/handleApiErrors';
import { useFetchUserDetailsWrapper } from 'queries/user';
import { useFetchProfileDetailsByUserWrapper } from 'queries/profile';

interface IBuilderTaskApply {
  taskId: number;
}

const useBuilderTaskApply = () => {
  const accessToken = getAccessToken();
  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsByUserWrapper({
    userId: userData?.user.userId,
  });

  const builderTaskApply = useMutation(
    async (payload: IBuilderTaskApply) => {
      const response = await fetch(`${config.ApiBaseUrl}/task/apply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profileData?.profileId,
          taskId: payload.taskId,
        }),
      });
      await handleApiErrors(response);
    },
    {
      onError: (error: any) => {
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
