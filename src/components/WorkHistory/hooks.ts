import {
  addProfileWorkplaceAction,
  removeProfileWorkplaceAction,
  updateProfileWorkplaceAction,
} from 'actions/profile';
import config from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleUnAuthorization } from 'utils/handleUnAuthorization';

const useAddProfileWorkplace = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const addProfileWorkplace = () => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const now = new Date();
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            role: 'Creative Designer',
            name: 'Google Corporation',
            description:
              'Lorem imsum text is here imsum text is here   imsum text is here imsum text is here imsumz shs s.  BioLorem imsum text is here imsum text is here   imsum text is here imsum text is here  imsum  here BioLorem imsum text is    imsum text is here imsum text is here imsum. BioLorem imsum text isimsum text is here   imsum text is here imsum text is here imsum. here imsum text is here',
            startDate: now.toISOString(),
            endDate: now.toISOString(),
            profileId: profile?.profileId,
          };

          const response = await fetch(
            `${config.ApiBaseUrl}/profile/workplace`,
            {
              signal,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(payload),
            }
          );
          const json = await handleApiErrors(response);

          dispatch(addProfileWorkplaceAction(json));
        } catch (err) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return addProfileWorkplace;
};

const useRemoveProfileWorkplace = () => {
  const dispatch = useDispatch();

  const removeProfileWorkplace = (workplaceId: number) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const response = await fetch(
            `${config.ApiBaseUrl}/profile/workplace/${workplaceId}`,
            {
              signal,
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          await handleApiErrors(response);

          dispatch(removeProfileWorkplaceAction(workplaceId));
        } catch (err) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return removeProfileWorkplace;
};

interface IUpdateProfileWorkplaceParameters {
  workplaceId: number;
  role: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const useUpdateProfileWorkplace = () => {
  const dispatch = useDispatch();

  const updateProfileWorkplace = ({
    workplaceId,
    role,
    name,
    description,
    startDate,
    endDate,
  }: IUpdateProfileWorkplaceParameters) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            workplaceId,
            role,
            name,
            description,
            startDate,
            endDate,
          };

          const response = await fetch(
            `${config.ApiBaseUrl}/profile/workplace/${workplaceId}`,
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
          dispatch(
            updateProfileWorkplaceAction({
              workplaceId,
              role,
              name,
              description,
              startDate,
              endDate,
            })
          );
        } catch (err) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return updateProfileWorkplace;
};

export {
  useAddProfileWorkplace,
  useRemoveProfileWorkplace,
  useUpdateProfileWorkplace,
};
