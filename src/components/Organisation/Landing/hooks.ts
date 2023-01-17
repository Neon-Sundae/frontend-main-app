import config from 'config';
import { IOrganisation } from 'interfaces/organisation';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

interface IReturnType {
  organisation: IOrganisation;
  isLoading: boolean;
}

const useFetchOrganisation = (): IReturnType => {
  const { orgId } = useParams();

  const { data, isLoading } = useQuery(
    ['organisation'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/${orgId}`,
        {
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const json = await handleApiErrors(response);
      return json;
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return { organisation: data, isLoading };
};

export default useFetchOrganisation;
