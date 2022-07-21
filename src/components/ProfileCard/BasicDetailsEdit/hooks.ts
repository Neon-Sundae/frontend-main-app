import { editProfile, updateProfileDetailsAction } from 'actions/profile';
import { updateUserName } from 'actions/user';
import config from 'config';
import { useDispatch } from 'react-redux';
import { getAccessToken } from 'utils/authFn';

import { handleUnAuthorization } from 'utils/handleUnAuthorization';

import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
interface IUpdateProfileDetailsParameters {
  userId: number | undefined;
  profileId: number | undefined;
  name: string;
  title: string;
  description: string;
  picture: string;
}

const useUpdateProfileDetails = () => {

  const dispatch = useDispatch();
  const updateProfileWorkplace = ({
    userId,
    profileId,
    name,
    title,
    description,
    picture
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
            picture
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

interface IReturnType {
  data: any;
  isLoading: boolean;
  refetch: () => any;
}

const fetchNFTs = (walletId: any, agree: boolean): IReturnType => {
  const chain = 'polygon';
  const { data, isLoading, refetch } = useQuery(
    'fetchNFTs',
    async () => {
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2/${walletId}/nft?chain=${chain}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.MORALIS_API_KEY || '',
          },
        }
      );
      const res = await response.json();
      return res;
    },
    {
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({ error, explicitMessage: 'Unable to fetch nfts' });
      },
      enabled: false,
    }
  );
  return { data: data, isLoading: isLoading, refetch };
};

export { useUpdateProfileDetails, fetchNFTs };
