import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';

interface IGetS3SignedUrl {
  fileName: string | undefined;
  folderName: string;
  type: string;
}

const getS3SignedUrl = async (payload: IGetS3SignedUrl) => {
  const accessToken = getAccessToken();

  try {
    const response = await fetch(`${config.ApiBaseUrl}/aws-ops/s3-upload-url`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const json = await handleApiErrors(response);
    return json;
  } catch (e) {
    console.log(e);
    throw new Error('Failed to get signed url');
  }
};

export default getS3SignedUrl;
