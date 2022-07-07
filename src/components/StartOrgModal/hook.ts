import { createOrg } from 'actions/organisation';
import config from 'config';
import { IOrgApiResponse } from 'interfaces/organisation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { useNavigate } from 'react-router-dom';

interface ICreateOrg {
  name: string;
  description: string;
}

const useCreateOrg = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.user?.userId);

  const navigate = useNavigate();

  const createOrganisation = ({ name, description }: ICreateOrg) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            userId,
            name,
            description,
          };

          const response = await fetch(`${config.ApiBaseUrl}/organisation`, {
            signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          });

          const json: IOrgApiResponse = await handleApiErrors(response);

          dispatch(createOrg(json));
          navigate(`../organisation/${json.organisationId}`);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  };

  return { createOrganisation };
};

export default useCreateOrg;
