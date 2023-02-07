import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { IUserOrganisationMember } from 'interfaces/user';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useIsOrganisationMember = (
  userId: number | undefined
): IUserOrganisationMember => {
  const accessToken = getAccessToken();

  const { data } = useQuery(
    ['is-organisaton_member', userId],
    async () => {
      const response = await fetch(
        `${config.ApiBaseUrl}/user/organisation-member/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const json = await handleApiErrors(response);
      return json;
    },
    {
      retry: 1,
      enabled: userId !== undefined,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch user details',
        });
      },
    }
  );

  if (data) return data;
  return { isOrganisationMember: undefined };
};

export default useIsOrganisationMember;
