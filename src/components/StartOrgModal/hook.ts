import config from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { useNavigate } from 'react-router-dom';
import { updateUser } from 'actions/user';
import { useMutation } from 'react-query';
import { handleError } from 'utils/handleUnAuthorization';

const useCreateOrganisation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = getAccessToken();

  const user = useSelector((state: RootState) => state.user.user);

  const createOrganisation = useMutation(
    (formData: FormData) =>
      fetch(`${config.ApiBaseUrl}/organisation`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }),
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: (data: Response) => {
        dispatch(updateUser({ ...user, isFounder: true }));
        data.json().then(json => {
          navigate(`../organisation/${json.organisationId}`);
        });
      },
    }
  );

  return createOrganisation;
};

export default useCreateOrganisation;
