import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';

// Not a hook, better move API calls in some other folder
const saveProjectContractAddress = async (payload: any, projectId: string) => {
  try {
    const ac = new AbortController();
    const { signal } = ac;
    const accessToken = getAccessToken();

    const response = await fetch(
      `${config.ApiBaseUrl}/fl-project/${projectId}`, // TODO - Need to update projectId here
      {
        signal,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );
    await handleApiErrors(response);
  } catch (err) {
    console.log(err);
  }
};

export default saveProjectContractAddress;
