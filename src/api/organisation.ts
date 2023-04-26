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

export { fetchAllOrganisations };
