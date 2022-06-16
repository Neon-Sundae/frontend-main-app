import { fillProfileData } from 'actions/profile';
import { fillProfileSkillsData } from 'actions/skills';
import config from 'config';
import { IProfileApiResponse } from 'interfaces/profile';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { normalizeSkills } from 'utils/normalizeSkills';

const useGetProfileData = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.user?.userId);
  const accessToken = getAccessToken();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (userId && accessToken) {
        const ac = new AbortController();
        const { signal } = ac;

        try {
          const response = await fetch(
            `${config.ApiBaseUrl}/profile/userId/${userId}`,
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
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
};

export default useGetProfileData;
