import config from 'config';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { getCurrentUserProfilePicture } from 'actions/profile';
import { handleError } from 'utils/handleUnAuthorization';
import { IProfileApiResponse } from 'interfaces/profile';

const useFetchCurrentUserProfilePicture = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const accessToken = getAccessToken();

  const { data } = useQuery(
    ['current-user-profile-picture', user],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/profile/userId/${user?.userId}`,
        {
          signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const json: IProfileApiResponse = await handleApiErrors(response);
      dispatch(getCurrentUserProfilePicture(json.picture));
      return json.picture;
    },
    {
      enabled: user !== undefined,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch current user profile picture',
        });
      },
    }
  );
  return { currentUserProfilePicture: data };
};

export default useFetchCurrentUserProfilePicture;
