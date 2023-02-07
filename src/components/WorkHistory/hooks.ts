import { useQuery } from '@tanstack/react-query';
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
import {
  handleError,
  handleUnAuthorization,
} from 'utils/handleUnAuthorization';

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
            description: 'Add a brief information about the workplace.',
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
  keyName: string;
  value: string;
}

const useUpdateProfileWorkplace = () => {
  const dispatch = useDispatch();

  const updateProfileWorkplace = ({
    workplaceId,
    keyName,
    value,
  }: IUpdateProfileWorkplaceParameters) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      const ac = new AbortController();
      const { signal } = ac;

      (async () => {
        try {
          const payload = {
            workplaceId,
            [keyName]: value,
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
          dispatch(updateProfileWorkplaceAction(workplaceId, keyName, value));
        } catch (err) {
          console.log(err);
          handleUnAuthorization(err);
        }
      })();
    }
  };

  return updateProfileWorkplace;
};

const useFetchAllOrganisations = () => {
  const accessToken = getAccessToken();
  const { data } = useQuery(
    ['all_organisations'],
    async () => {
      const response = await fetch(`${config.ApiBaseUrl}/organisation/all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await handleApiErrors(response);
      return json;
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch all Organisation data',
        });
      },
    }
  );

  const normalizedOrganisationsData = data?.map(
    (organisation: { name: string; organisationId: number }) => ({
      label: organisation.name,
      value: organisation.organisationId,
    })
  );

  return { normalizedOrganisationsData };
};

export {
  useAddProfileWorkplace,
  useRemoveProfileWorkplace,
  useUpdateProfileWorkplace,
  useFetchAllOrganisations,
};
