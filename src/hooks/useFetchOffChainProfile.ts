import config from 'config';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { normalizeSkills } from 'utils/normalizeSkills';
import { fillProfileData } from 'actions/profile';
import { fillProfileSkillsData } from 'actions/skills';
import { handleError } from 'utils/handleUnAuthorization';
import { IProfileApiResponse } from 'interfaces/profile';

const useFetchOffChainProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const accessToken = getAccessToken();

  const { data } = useQuery(
    ['off-chain-profile', user, profile],
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
      const skillsData = normalizeSkills(json.profileSkills);
      dispatch(fillProfileData(json));
      dispatch(fillProfileSkillsData(skillsData));

      return json;
    },
    {
      enabled: user !== undefined && profile === null,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
        });
      },
    }
  );

  return { offChainProfile: data };
};

export default useFetchOffChainProfile;
