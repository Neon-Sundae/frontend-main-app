import config from 'config';
import { getAccessToken } from 'utils/authFn';
import getProfileProjects from 'utils/getProfileProjects';
import { handleApiErrors } from 'utils/handleApiErrors';
import { normalizeAllOrganisations } from 'utils/normalizeAllOrganisations';

const fetchAllOrganisations = async () => {
  const accessToken = getAccessToken();

  const response = await fetch(`${config.ApiBaseUrl}/organisation/all`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await handleApiErrors(response);
  const normalizedData = normalizeAllOrganisations(json);
  return normalizedData;
};

const fetchOrganisationDetails = async (organisationId: string | undefined) => {
  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/${organisationId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const json = await handleApiErrors(response);
  return json;
};

const fetchUserOrganisations = async (userId: number | undefined) => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/user/${userId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json = await handleApiErrors(response);
  return json;
};

const acceptOrganisationInvitation = async (
  invitationToken: string
): Promise<number> => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/invitation/accept`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ invitationToken }),
    }
  );
  const json = await handleApiErrors(response);
  return json.organisationId;
};

const rejectOrganisationInvitation = async (invitationToken: string) => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/invitation/reject`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ invitationToken }),
    }
  );
  await handleApiErrors(response);
};

const fetchOrganisationMembers = async (organisationId: string | undefined) => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/members/${organisationId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json = await handleApiErrors(response);
  return json;
};

const addOrganisationMemberInvitation = async (
  organisationId: string | undefined,
  email: string
) => {
  const accessToken = getAccessToken();

  const payload = {
    email,
    organisationId: Number(organisationId),
  };

  const response = await fetch(`${config.ApiBaseUrl}/organisation/add-member`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  await handleApiErrors(response);
};

const transferOwnershipInvitation = async (
  organisationId: string | undefined,
  email: string
) => {
  const accessToken = getAccessToken();

  const payload = {
    email,
    organisationId: Number(organisationId),
  };

  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/transfer-ownership`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  await handleApiErrors(response);
};

const deleteOrganisationMember = async (memberId: string) => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/member/delete/${memberId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  await handleApiErrors(response);
};

const deleteUserInvitation = async (memberId: string) => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/invitation/delete/${memberId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  await handleApiErrors(response);
};

const fetchUserProjects = async (userId: number | undefined) => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/organisation/user-projects/${userId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json = await handleApiErrors(response);
  const normalizedProjectData = getProfileProjects(json);
  return normalizedProjectData;
};

export {
  fetchAllOrganisations,
  fetchOrganisationDetails,
  fetchUserOrganisations,
  acceptOrganisationInvitation,
  rejectOrganisationInvitation,
  fetchOrganisationMembers,
  addOrganisationMemberInvitation,
  transferOwnershipInvitation,
  deleteOrganisationMember,
  deleteUserInvitation,
  fetchUserProjects,
};
