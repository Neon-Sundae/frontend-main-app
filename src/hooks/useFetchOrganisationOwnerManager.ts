import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { IMember, IMemberData } from 'interfaces/organisation';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchOrganisationOwnerManager = (
  organisationId: string | undefined
): { members: IMemberData } => {
  const accessToken = getAccessToken();

  const { data } = useQuery(
    ['organisaton_owner-managers', organisationId],
    async () => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/${organisationId}/owner-managers`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const json: IMember[] = await handleApiErrors(response);

      const managers = json.filter((d: IMember) => d.role === 'Type.Manager');
      const owner = json.filter((d: IMember) => d.role === 'Type.Owner');

      return { members: { managers, owner, all: json } };
    },
    {
      retry: 1,
      enabled: organisationId !== undefined,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch organisation members',
        });
      },
    }
  );

  if (data) {
    return { members: data.members };
  }

  return { members: { managers: [], owner: [], all: [] } };
};

export default useFetchOrganisationOwnerManager;
