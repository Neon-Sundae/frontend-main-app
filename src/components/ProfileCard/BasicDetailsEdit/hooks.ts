import { editProfile, updateProfileDetailsAction } from 'actions/profile';
import { updateUserName } from 'actions/user';
import config from 'config';
import { useDispatch } from 'react-redux';
import { getAccessToken } from 'utils/authFn';

import {
  handleUnAuthorization,
  handleError,
} from 'utils/handleUnAuthorization';

import { useQuery } from '@tanstack/react-query';
import { handleApiErrors } from 'utils/handleApiErrors';

interface IUpdateProfileDetailsParameters {
  userId: number | undefined;
  profileId: number | undefined;
  name: string;
  title: string;
  description: string;
  picture?: string;
}

const useUpdateProfileDetails = () => {
  const dispatch = useDispatch();
  const updateProfileWorkplace = ({
    userId,
    profileId,
    name,
    title,
    description,
    picture,
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
            picture,
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
          dispatch(
            updateProfileDetailsAction(title, description, picture, name)
          );
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

interface IReturnType {
  data: any;
  isLoading: boolean;
  refetch: () => any;
}

const fetchNFTs = (walletId: any, agree: boolean): IReturnType => {
  const chain = 'polygon';
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading, refetch } = useQuery(
    ['fetchNFTs'],
    async () => {
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2/${walletId}/nft?chain=${chain}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY || '',
          },
        }
      );
      const res = await response.json();
      return res;
    },
    {
      retry: 1,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({ error, explicitMessage: 'Unable to fetch nfts' });
      },
      enabled: false, // to run query on click
    }
  );
  return { data, isLoading, refetch };
};

export { useUpdateProfileDetails, fetchNFTs };
