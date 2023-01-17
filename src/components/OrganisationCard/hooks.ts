import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useParams } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchUserOrgs = () => {
  const { profileId } = useParams();
  const accessToken = getAccessToken();

  const { data } = useQuery(
    ['userOrgs'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/user/${profileId}`,
        {
          signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await handleApiErrors(response);
      return json;
    },
    {
      enabled: profileId !== undefined,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
        });
      },
    }
  );
  return { data };
};

export default useFetchUserOrgs;
