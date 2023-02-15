import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { handleApiErrors } from 'utils/handleApiErrors';
import { useUpdateOrganisationImage } from 'components/Organisation/Banner/hooks';
import { Dispatch, SetStateAction } from 'react';

interface ICreateOrganisationPayload {
  name: string;
  description: string;
  userId: string;
  image: File | undefined;
}

const useCreateOrganisation = (
  setDisableButton: Dispatch<SetStateAction<boolean>>
) => {
  const navigate = useNavigate();
  const accessToken = getAccessToken();
  const updateOrganisationImageHandler = useUpdateOrganisationImage();

  const createOrganisation = async (payload: ICreateOrganisationPayload) => {
    try {
      const { image, ...rest } = payload;
      const response = await fetch(`${config.ApiBaseUrl}/organisation`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rest),
      });
      const json = await handleApiErrors(response);

      if (image) {
        await updateOrganisationImageHandler(
          image,
          'profileImage',
          'profile',
          json.organisationId
        );
      }
      navigate(`/organisation/${json.organisationId}`);
    } catch (e) {
      console.log(e);
      setDisableButton(false);
      toast.error('Failed to create organisation');
    }
  };

  return createOrganisation;
};

export default useCreateOrganisation;
