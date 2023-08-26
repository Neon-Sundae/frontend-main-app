import config from 'config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import { handleError } from 'utils/handleUnAuthorization';

interface IUpdateOrgCustomButton {
  customButtonLabel: string;
  customButtonLink: string;
  handleClose: () => void;
}

const useUpdateOrgCustomButton = (
  organisationId: number,
  handleClose: () => void
) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateOrgCustomButton = useMutation(
    (payload: IUpdateOrgCustomButton) =>
      fetch(`${config.ApiBaseUrl}/organisation/${organisationId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['organisation']);
        handleClose();
      },
    }
  );

  return updateOrgCustomButton;
};

export default useUpdateOrgCustomButton;
