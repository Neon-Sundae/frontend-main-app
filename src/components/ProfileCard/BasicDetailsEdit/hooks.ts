import { editProfile, updateProfileDetailsAction } from 'actions/profile';
import { updateUserName } from 'actions/user';
import config from 'config';
import { useDispatch } from 'react-redux';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleUnAuthorization } from 'utils/handleUnAuthorization';

interface IUpdateProfileDetailsParameters {
  userId: number | undefined;
  profileId: number | undefined;
  name: string;
  title: string;
  description: string;
}

const useUpdateProfileDetails = () => {
  const dispatch = useDispatch();

  const updateProfileWorkplace = ({
    userId,
    profileId,
    name,
    title,
    description,
  }: IUpdateProfileDetailsParameters) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            userId,
            profileId,
            name,
            title,
            description,
          };

          const response = await fetch(
            `${config.ApiBaseUrl}/user/updateUserAndProfile`,
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
          await handleApiErrors(response);
          dispatch(updateProfileDetailsAction(title, description));
          dispatch(updateUserName(name));
          dispatch(editProfile(false));
        } catch (err) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return updateProfileWorkplace;
};

export default useUpdateProfileDetails;
