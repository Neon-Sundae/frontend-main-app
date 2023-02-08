import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { IOwnerData } from 'interfaces/organisation';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchOrganisationOwner = (
  organisationId: string | undefined
): { owner: IOwnerData } => {
  const accessToken = getAccessToken();

  const { data } = useQuery(
    ['organisaton_owner', organisationId],
    async () => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/${organisationId}/owner`,
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
      enabled: organisationId !== undefined,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch organisation owner',
        });
      },
    }
  );
  return { owner: data };
};

export default useFetchOrganisationOwner;
