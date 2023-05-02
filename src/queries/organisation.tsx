import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptOrganisationInvitation,
  addOrganisationMemberInvitation,
  deleteOrganisationMember,
  deleteUserInvitation,
  fetchAllOrganisations,
  fetchOrganisationDetails,
  fetchOrganisationMembers,
  fetchUserOrganisations,
  fetchUserProjects,
  rejectOrganisationInvitation,
  transferOwnershipInvitation,
} from 'api/organisation';
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
};
