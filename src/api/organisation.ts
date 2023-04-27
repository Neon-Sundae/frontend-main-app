import config from 'config';
import { getAccessToken } from 'utils/authFn';
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

export {
  fetchAllOrganisations,
  fetchOrganisationDetails,
  fetchUserOrganisations,
  acceptOrganisationInvitation,
  rejectOrganisationInvitation,
};
