import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { handleError } from 'utils/handleUnAuthorization';

const useCreateOrganisation = () => {
  const navigate = useNavigate();
  const accessToken = getAccessToken();

  const createOrganisation = useMutation(
    (formData: FormData) =>
      fetch(`${config.ApiBaseUrl}/organisation`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }),
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: async (data: Response) => {
        const json = await data.json();
        navigate(`/organisation/${json.organisationId}`);
      },
    }
  );

  return createOrganisation;
};

export default useCreateOrganisation;
