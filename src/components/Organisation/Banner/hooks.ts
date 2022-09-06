import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import { handleError } from 'utils/handleUnAuthorization';

interface IUpdateOrgSocials {
  linkedin: string;
  twitter: string;
  instagram: string;
}

const useUpdateOrgSocials = (
  organisationId: number,
  setOpen: Dispatch<SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateOrgSocials = useMutation(
    (payload: IUpdateOrgSocials) =>
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
        setOpen(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['organisation']);
        setOpen(false);
      },
    }
  );

  return updateOrgSocials;
};

interface IUpdateOrg {
  name?: string | null;
  description?: string | null;
  whitepaper?: string | null;
  website?: string | null;
  file?: any;
}

const useUpdateOrganisation = (organisationId: number) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateOrgSocials = useMutation(
    (payload: IUpdateOrg) =>
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
      },
    }
  );

  return updateOrgSocials;
};

const useUpdateOrgPic = (organisationId: number) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateOrgSocials = useMutation(
    (formData: FormData) =>
      fetch(`${config.ApiBaseUrl}/organisation/${organisationId}`, {
        method: 'PATCH',
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
      onSuccess: () => {
        queryClient.invalidateQueries(['organisation']);
      },
    }
  );

  return updateOrgSocials;
};

const useUpdateOrgCoverPic = (organisationId: number) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateOrgSocials = useMutation(
    (formData: FormData) =>
      fetch(`${config.ApiBaseUrl}/organisation/${organisationId}`, {
        method: 'PATCH',
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
      onSuccess: () => {
        queryClient.invalidateQueries(['organisation']);
      },
    }
  );

  return updateOrgSocials;
};

export {
  useUpdateOrgSocials,
  useUpdateOrganisation,
  useUpdateOrgPic,
  useUpdateOrgCoverPic,
};
