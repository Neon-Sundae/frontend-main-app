import { QueryClient, useQueryClient } from '@tanstack/react-query';
import config from 'config';
import { toast } from 'react-hot-toast';
import { getAccessToken } from 'utils/authFn';
import getS3SignedUrl from 'utils/awsOps/getS3SignedUrl';
import uploadToS3 from 'utils/awsOps/uploadToS3';
import { handleApiErrors } from 'utils/handleApiErrors';

interface IUpdateOrganisationImageUrl {
  [x: string]: string;
}

const updateOrganisationImageUrl = async (
  queryClient: QueryClient,
  organisationId: number,
  payload: IUpdateOrganisationImageUrl
) => {
  try {
    const accessToken = getAccessToken();
    const response = await fetch(
      `${config.ApiBaseUrl}/organisation/${organisationId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    await handleApiErrors(response);
    queryClient.invalidateQueries(['organisation']);
  } catch (e) {
    console.log(e);
  }
};

const useUpdateOrganisationImage = () => {
  const queryClient = useQueryClient();

  const updateOrganisationImageHandler = async (
    image: File | null,
    key: string,
    imageType: string,
    organisationId: number
  ) => {
    try {
      if (image) {
        const response: Partial<{ uploadUrl: string }> = await getS3SignedUrl({
          fileName: image.name,
          folderName: `${organisationId}/${imageType}`,
          type: 'organisation',
        });

        if (response && response.uploadUrl) {
          await uploadToS3(response.uploadUrl, image);

          const imagePayload = {
            [key]: response.uploadUrl.split('?')[0],
          };

          await updateOrganisationImageUrl(
            queryClient,
            organisationId,
            imagePayload
          );
        }
      }
    } catch (e) {
      console.log(e);
      toast.error('Failed to upload image');
    }
  };

  return updateOrganisationImageHandler;
};

export { useUpdateOrganisationImage };
