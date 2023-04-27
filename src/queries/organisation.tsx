import { useMutation, useQuery } from '@tanstack/react-query';
import {
  acceptOrganisationInvitation,
  fetchAllOrganisations,
  fetchOrganisationDetails,
  fetchUserOrganisations,
  rejectOrganisationInvitation,
} from 'api/organisation';

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

export {
  useFetchAllOrganisations,
  useFetchOrganisationDetail,
  useFetchUserOrganisations,
  useAcceptOrganisationInvitation,
  useRejectOrganisationInvitation,
};
