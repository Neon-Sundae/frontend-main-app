import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import { handleError } from 'utils/handleUnAuthorization';
import { handleApiErrors } from 'utils/handleApiErrors';
import { toast } from 'react-hot-toast';
import getS3SignedUrl from 'utils/awsOps/getS3SignedUrl';
import uploadToS3 from 'utils/awsOps/uploadToS3';

interface IUpdateOrgSocials {
  linkedin: string;
  twitter: string;
  instagram: string;
}

const useUpdateOrgSocials = (
  organisationId: number,
  setOpen: Dispatch<SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateOrgSocials = useMutation(
    (payload: IUpdateOrgSocials) =>
      fetch(`${config.ApiBaseUrl}/organisation/${organisationId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
        setOpen(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['organisation']);
        setOpen(false);
      },
    }
  );

  return updateOrgSocials;
};

interface IUpdateOrg {
  name?: string | null;
  description?: string | null;
  whitepaper?: string | null;
  website?: string | null;
  file?: any;
}

const useUpdateOrganisation = (organisationId: number) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateOrgSocials = useMutation(
    (payload: IUpdateOrg) =>
      fetch(`${config.ApiBaseUrl}/organisation/${organisationId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['organisation']);
      },
    }
  );

  return updateOrgSocials;
};

interface IUpdateOrganisationImageUrl {
  [x: string]: string;
}

const updateOrganisationImageUrl = async (
  accessToken: any,
  queryClient: QueryClient,
  organisationId: number,
  payload: IUpdateOrganisationImageUrl
) => {
  try {
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

const useUpdateOrganisationImage = (organisationId: number) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const updateOrganisationImageHandler = async (
    image: File | null,
    key: string,
    imageType: string
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
            accessToken,
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

export {
  useUpdateOrgSocials,
  useUpdateOrganisation,
  useUpdateOrganisationImage,
};
