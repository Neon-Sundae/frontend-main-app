import { fillProfileData, getUSDCBalance, getXP } from 'actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { GET_PROFILE_CONTRACT_ADDRESS } from 'actions/profile/types';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { handleApiErrors } from 'utils/handleApiErrors';
import { IProfileApiResponse } from 'interfaces/profile';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import getProfileDetails from 'utils/contractFns/getProfileDetails';

const useProfile = () => {
  const dispatch = useDispatch();

  const fetchOnChainProfileData = async (address: string) => {
    try {
      if (address !== '0x0000000000000000000000000000000000000000' && address) {
        const [, , , xp, usdc] = await getProfileDetails(address);

        dispatch(getXP(xp));
        dispatch(getUSDCBalance(usdc));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getProfileContractAddress = async (address: string | undefined) => {
    try {
      const result = await getProfileContractAddress(address);
      dispatch({
        type: GET_PROFILE_CONTRACT_ADDRESS,
        payload: result,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    fetchOnChainProfileData,
    getProfileContractAddress,
  };
};

const useFetchPublicProfile = (profileId: string | undefined) => {
  const dispatch = useDispatch();
  const accessToken = getAccessToken();
  const user = useSelector((state: RootState) => state.user.user);

  useQuery(
    ['public_profile'],
    async () => {
      const response = await fetch(
        `${config.ApiBaseUrl}/profile/${profileId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json: IProfileApiResponse = await handleApiErrors(response);
      dispatch(fillProfileData(json));
    },
    {
      retry: 1,
      enabled:
        user !== undefined &&
        profileId !== undefined &&
        user.userId !== parseInt(profileId, 10),
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        // handleError({
        //   error,
        //   explicitMessage: 'Unable to fetch profile data',
        // });
      },
    }
  );
};

export { useProfile, useFetchPublicProfile };
