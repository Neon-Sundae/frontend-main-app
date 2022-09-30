import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import getProfileProjects from 'utils/getProfileProjects';
import getRandomString from 'utils/getRandomString';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

interface IProps {
  open: boolean;
}

const useFetchWalletProjects = ({ open }: IProps) => {
  const accessToken = getAccessToken();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const { data } = useQuery(
    ['userOrgs'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/user-projects/${profile?.profileId}`,
        {
          signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await handleApiErrors(response);
      const normalizedProjectData = getProfileProjects(json);
      return normalizedProjectData;
    },
    {
      enabled: profile?.profileId !== undefined && open,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch user projects',
        });
      },
    }
  );

  if (data) {
    const baseProjectList = [
      {
        id: getRandomString(5),
        name: 'My Profile',
        smartContractId: profile?.profileSmartContractId,
        type: 'profile_contract',
      },
    ];

    return { flProjects: [...baseProjectList, ...data] };
  }

  return { flProjects: [] };
};

export default useFetchWalletProjects;
