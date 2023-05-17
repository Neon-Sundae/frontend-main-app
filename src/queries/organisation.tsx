import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IUpdateOrganisationDetailsPayload,
  acceptOrganisationInvitation,
  addOrganisationMemberInvitation,
  createOrganisation,
  deleteOrganisationMember,
  deleteUserInvitation,
  fetchAllOrganisations,
  fetchOrganisaionOwner,
  fetchOrganisationDetails,
  fetchOrganisationMembers,
  fetchOrganisationOwnerManager,
  fetchUserOrganisations,
  fetchUserProjects,
  rejectOrganisationInvitation,
  transferOwnershipInvitation,
  updateOrganisationDetails,
} from 'api/organisation';
import {
  ICreateOrganisationPayload,
  IMember,
  IMemberData,
  IOrganisationDetails,
} from 'interfaces/organisation';
import { Dispatch, SetStateAction } from 'react';
import getRandomString from 'utils/getRandomString';

const useFetchAllOrganisations = () => {
  return useQuery({
    queryKey: ['all-organisations'],
    queryFn: fetchAllOrganisations,
  });
};

const useFetchOrganisationDetail = (organisationId: string | undefined) => {
  return useQuery({
    queryKey: ['organisation-detail', organisationId],
    queryFn: () => fetchOrganisationDetails(organisationId),
    enabled: organisationId !== undefined,
  });
};

const useFetchUserOrganisations = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['user-organisations', userId],
    queryFn: () => fetchUserOrganisations(userId),
    enabled: userId !== undefined,
  });
};

const useAcceptOrganisationInvitation = () => {
  return useMutation({
    mutationFn: (invitationToken: string) =>
      acceptOrganisationInvitation(invitationToken),
  });
};

const useRejectOrganisationInvitation = () => {
  return useMutation({
    mutationFn: (invitationToken: string) =>
      rejectOrganisationInvitation(invitationToken),
  });
};

const useFetchOrganisationMembers = (organisationId: string | undefined) => {
  return useQuery({
    queryKey: ['organisation-members', organisationId],
    queryFn: () => fetchOrganisationMembers(organisationId),
    enabled: organisationId !== undefined,
  });
};

const useAddOrganisationMember = (organisationId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) =>
      addOrganisationMemberInvitation(organisationId, email),
    onSuccess: () => {
      queryClient.invalidateQueries(['organisation-members', organisationId]);
    },
  });
};

const useTransferOwnership = (organisationId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) =>
      transferOwnershipInvitation(organisationId, email),
    onSuccess: () => {
      queryClient.invalidateQueries(['organisation-members', organisationId]);
    },
  });
};

const useDeleteOrganisationMember = (organisationId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => deleteOrganisationMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries(['organisation-members', organisationId]);
    },
  });
};

const useDeleteUserInvitation = (organisationId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => deleteUserInvitation(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries(['organisation-members', organisationId]);
    },
  });
};

const useFetchUserProjects = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['user-projects', userId],
    queryFn: () => fetchUserProjects(userId),
    enabled: userId !== undefined,
  });
};

interface IUseFetchUserProjects {
  userId: number | undefined;
  profileSmartContractId: string | null | undefined;
  open: boolean;
}

const useFetchUserWalletProjects = ({
  userId,
  profileSmartContractId,
  open,
}: IUseFetchUserProjects) => {
  return useQuery({
    queryKey: ['user-projects', userId],
    queryFn: () => fetchUserProjects(userId),
    enabled: userId !== undefined && open,
    select: data => {
      const baseProjectList = [
        {
          id: getRandomString(5),
          name: 'My Profile',
          smartContractId: profileSmartContractId,
          type: 'profile_contract',
        },
      ];

      return [...baseProjectList, ...data];
    },
  });
};

const useFetchOrganisationOwner = (organisationId: string | undefined) => {
  return useQuery({
    queryKey: ['organisation-owner', organisationId],
    queryFn: () => fetchOrganisaionOwner(organisationId),
    enabled: organisationId !== undefined,
  });
};

const useFetchOrganisationOwnerManager = (
  organisationId: string | undefined
) => {
  return useQuery({
    queryKey: ['organisation-owner-manager', organisationId],
    queryFn: () => fetchOrganisationOwnerManager(organisationId),
    enabled: organisationId !== undefined,
    select: (data: IMember[]): IMemberData => {
      const managers: IMember[] = data.filter(
        (d: IMember) => d.role === 'Type.Manager'
      );
      const owner: IMember[] = data.filter(
        (d: IMember) => d.role === 'Type.Owner'
      );

      if (data) {
        return {
          managers,
          owner,
          all: data,
        };
      }

      return {
        managers: [],
        owner: [],
        all: [],
      };
    },
  });
};

const useCreateOrganisation = (
  setDisableButton?: Dispatch<SetStateAction<boolean>>
) => {
  return useMutation({
    mutationFn: (payload: ICreateOrganisationPayload) =>
      createOrganisation(payload),
    onError: () => {
      if (setDisableButton) setDisableButton(false);
    },
  });
};

const useUpdateOrganisationDetails = (
  organisationId: string | undefined,
  setOpen?: Dispatch<SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateOrganisationDetailsPayload) =>
      updateOrganisationDetails({ organisationId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries(['organisation-detail', organisationId]);
    },
    onSettled: () => {
      if (setOpen) setOpen(false);
    },
  });
};

export {
  useFetchAllOrganisations,
  useFetchOrganisationDetail,
  useFetchUserOrganisations,
  useAcceptOrganisationInvitation,
  useRejectOrganisationInvitation,
  useFetchOrganisationMembers,
  useAddOrganisationMember,
  useTransferOwnership,
  useDeleteOrganisationMember,
  useDeleteUserInvitation,
  useFetchUserProjects,
  useFetchUserWalletProjects,
  useFetchOrganisationOwner,
  useFetchOrganisationOwnerManager,
  useCreateOrganisation,
  useUpdateOrganisationDetails,
};
