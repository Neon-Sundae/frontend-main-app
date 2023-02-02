import config from 'config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import { toast } from 'react-hot-toast';
import { Dispatch, SetStateAction } from 'react';

const useFetchOrganisationMembers = () => {
  const { orgId } = useParams();
  const accessToken = getAccessToken();

  const { data, isLoading } = useQuery(
    ['organisation-members', orgId],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/members/${orgId}`,
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
      enabled: orgId !== undefined,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch org members',
        });
      },
    }
  );
  return { data, isLoading };
};

interface IUseAddManager {
  modalStatus: Dispatch<SetStateAction<boolean>>;
}

const useAddManager = ({ modalStatus }: IUseAddManager) => {
  const { orgId } = useParams();
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const addManagerInvitation = useMutation(
    async (email: string) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/add-member`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, organisationId: Number(orgId) }),
        }
      );
      await handleApiErrors(response);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['organisation-members']);
        toast.success('Sent the invitation');
        modalStatus(false);
      },
    }
  );

  return { addManagerInvitation };
};

const useTransferOwnership = ({ modalStatus }: IUseAddManager) => {
  const { orgId } = useParams();
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const transferOwnershipInvitation = useMutation(
    async (email: string) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/transfer-ownership`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, organisationId: Number(orgId) }),
        }
      );
      await handleApiErrors(response);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['organisation-members']);
        toast.success('Sent the invitation');
        modalStatus(false);
      },
    }
  );

  return { transferOwnershipInvitation };
};

export { useFetchOrganisationMembers, useAddManager, useTransferOwnership };
