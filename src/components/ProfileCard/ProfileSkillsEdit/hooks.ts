import {
  addProfileSkillAction,
  removeProfileSkillAction,
} from 'actions/profile';
import {
  addProfileNormalizeSkill,
  fillProfileSkillsData,
  INormalizeSkills,
} from 'actions/skills';
import { Option } from 'components/Select';
import config from 'config';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import {
  handleError,
  handleUnAuthorization,
} from 'utils/handleUnAuthorization';
import { deNormalizeSkills, normalizeSkills } from 'utils/normalizeSkills';

const useFetchAppSkills = () => {
  const { data } = useQuery(
    'appSkills',
    async ({ signal }) => {
      const response = await fetch(`${config.ApiBaseUrl}/skills`, {
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await handleApiErrors(response);
      const normalizedSkillsData = normalizeSkills(json);
      return normalizedSkillsData;
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({ error, explicitMessage: 'Unable to fetch skills' });
      },
    }
  );

  return { appSkills: data };
};

const useAddProfileSkill = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const addProfileSkill = (selectedValue: Option) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            profileId: profile?.profileId,
            skillsId: selectedValue?.value,
          };

          const response = await fetch(`${config.ApiBaseUrl}/profile/skill`, {
            signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          });
          await handleApiErrors(response);

          if (
            typeof selectedValue.value === 'number' &&
            typeof selectedValue.label === 'string'
          ) {
            const { label, value } = selectedValue;
            dispatch(addProfileNormalizeSkill({ label, value }));
            dispatch(
              addProfileSkillAction({
                skillsId: selectedValue.value,
                name: selectedValue.label,
              })
            );
          }
        } catch (err: any) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return addProfileSkill;
};

const useRemoveProfileSkill = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const removeProfileSkill = (
    skillsId: number,
    profileSkills: INormalizeSkills[]
  ) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            profileId: profile?.profileId,
            skillsId,
          };

          const response = await fetch(`${config.ApiBaseUrl}/profile/skill`, {
            signal,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          });
          await handleApiErrors(response);

          const newSkills = profileSkills.filter(el => el.value !== skillsId);
          dispatch(fillProfileSkillsData(newSkills));

          const deNormalizedSkills = deNormalizeSkills(newSkills);
          dispatch(removeProfileSkillAction(deNormalizedSkills));
        } catch (err: any) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return removeProfileSkill;
};

// eslint-disable-next-line import/prefer-default-export
export { useFetchAppSkills, useAddProfileSkill, useRemoveProfileSkill };
