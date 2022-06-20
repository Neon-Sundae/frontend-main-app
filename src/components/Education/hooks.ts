import {
  addProfileEducationAction,
  removeProfileEducationAction,
  updateProfileEducationAction,
} from 'actions/profile';
import config from 'config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleUnAuthorization } from 'utils/handleUnAuthorization';

const useAddProfileEducation = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const addProfileEducation = () => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const now = new Date();
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            degree: 'Creative Designer',
            university: 'Google Corporation',
            startDate: now.toISOString(),
            endDate: now.toISOString(),
            profileId: profile?.profileId,
          };

          const response = await fetch(
            `${config.ApiBaseUrl}/profile/education`,
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

          dispatch(addProfileEducationAction(json));
        } catch (err) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return addProfileEducation;
};

const useRemoveProfileEducation = () => {
  const dispatch = useDispatch();

  const removeProfileEducation = (educationId: number) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const response = await fetch(
            `${config.ApiBaseUrl}/profile/education/${educationId}`,
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

          dispatch(removeProfileEducationAction(educationId));
        } catch (err) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return removeProfileEducation;
};

interface IUpdateProfileEducationParameters {
  educationId: number;
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
}

const useUpdateProfileEducation = () => {
  const dispatch = useDispatch();

  const updateProfileEducation = ({
    educationId,
    degree,
    university,
    startDate,
    endDate,
  }: IUpdateProfileEducationParameters) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            degree,
            university,
            startDate,
            endDate,
          };

          console.log(payload);

          const response = await fetch(
            `${config.ApiBaseUrl}/profile/education/${educationId}`,
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
            updateProfileEducationAction(
              educationId,
              degree,
              university,
              startDate,
              endDate
            )
          );
        } catch (err) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return updateProfileEducation;
};

export {
  useAddProfileEducation,
  useRemoveProfileEducation,
  useUpdateProfileEducation,
};
