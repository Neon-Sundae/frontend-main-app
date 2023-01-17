import config from 'config';
import { IOrganisation } from 'interfaces/organisation';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';

interface IReturnType {
  organisation: IOrganisation;
  isLoading: boolean;
  refetch: any;
}

const useFetchOrganisation = (selectedOrgId: any): IReturnType => {
  const { orgId } = useParams();

  const { data, isLoading, refetch } = useQuery(
    ['organisation'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/${selectedOrgId || orgId}`,
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
        handleError({ error, explicitMessage: 'Unable to fetch organisation' });
      },
    }
  );

  return { organisation: data, isLoading, refetch };
};

interface IReturnTypeUserOrgs {
  data: any;
  isLoading: boolean;
}

const useFetchUserOrganisation = (): IReturnTypeUserOrgs => {
  const accessToken = getAccessToken();
  const user = useSelector((state: RootState) => state.user.user);
  const { data, isLoading } = useQuery(
    ['userOrgs'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/user/${user?.userId}`,
        {
          signal,
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
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({ error, explicitMessage: 'Unable to fetch organisation' });
      },
    }
  );

  return { data, isLoading };
};

export { useFetchOrganisation, useFetchUserOrganisation };
