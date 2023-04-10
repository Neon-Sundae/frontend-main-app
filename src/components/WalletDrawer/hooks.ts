import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { useFetchProfileDetailsByUserWrapper } from 'queries/profile';
import { useFetchUserDetailsWrapper } from 'queries/user';
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
  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsByUserWrapper({
    userId: userData?.user.userId,
  });

  const { data } = useQuery(
    ['userOrgs'],
    async ({ signal }) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/user-projects/${userData?.profileId}`,
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
      enabled: userData?.profileId !== undefined && open,
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
        smartContractId: profileData?.profileSmartContractId,
        type: 'profile_contract',
      },
    ];

    return { flProjects: [...baseProjectList, ...data] };
  }

  return { flProjects: [] };
};

export default useFetchWalletProjects;
