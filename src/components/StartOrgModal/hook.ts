import config from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { useNavigate } from 'react-router-dom';
import { updateUser } from 'actions/user';
import { toast } from 'react-hot-toast';
import { handleApiErrors } from 'utils/handleApiErrors';
import { useUpdateOrganisationImage } from 'components/Organisation/Banner/hooks';

interface ICreateOrganisationPayload {
  name: string;
  description: string;
  userId: string;
  image: File | undefined;
}

const useCreateOrganisation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = getAccessToken();
  const updateOrganisationImageHandler = useUpdateOrganisationImage();

  const user = useSelector((state: RootState) => state.user.user);

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

      dispatch(updateUser({ ...user, isFounder: true }));
      navigate(`../organisation/${json.organisationId}`);
    } catch (e) {
      console.log(e);
      toast.error('Failed to create organisation');
    }
  };

  return createOrganisation;
};

export default useCreateOrganisation;
