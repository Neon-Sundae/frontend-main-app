import { useMutation, useQuery } from '@tanstack/react-query';
import {
  acceptOrganisationInvitation,
  fetchAllOrganisations,
  rejectOrganisationInvitation,
} from 'api/organisation';

const useFetchAllOrganisations = () => {
  return useQuery({
    queryKey: ['all-organisations'],
    queryFn: fetchAllOrganisations,
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
  useAcceptOrganisationInvitation,
  useRejectOrganisationInvitation,
};
