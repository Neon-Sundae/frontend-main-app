import config from 'config';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';

const useCreateProject = () => {
  const navigate = useNavigate();
  const accessToken = getAccessToken();

  const createProject = useMutation(
    (data: any) =>
      fetch(`${config.ApiBaseUrl}/fl-project`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }),
    {
      onSuccess: async res => {
        const body = await res.json();
        navigate(`/project/${body.flProjectId_uuid}`);
      },
      onError: err => {
        console.log('err', err);
      },
    }
  );

  return createProject;
};

export default useCreateProject;
