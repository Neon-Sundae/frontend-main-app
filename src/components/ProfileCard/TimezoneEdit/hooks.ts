import { updateProfileTimezoneAction } from 'actions/profile';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleUnAuthorization } from 'utils/handleUnAuthorization';

interface FunctionParameters {
  timezone: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const useUpdateProfileTimezone = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const updateProfileTimezone = ({ timezone, setOpen }: FunctionParameters) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            timezone,
          };

          const response = await fetch(
            `${config.ApiBaseUrl}/profile/${profile?.profileId}`,
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
          dispatch(updateProfileTimezoneAction(timezone));
        } catch (err: any) {
          console.log(err);
          handleUnAuthorization(err);
        } finally {
          setOpen(false);
        }
      })();
    }
  };

  return updateProfileTimezone;
};

export default useUpdateProfileTimezone;
