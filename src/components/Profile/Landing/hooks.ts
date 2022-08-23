import { AbiItem } from 'web3-utils';
import { fillProfileData, getUSDCBalance, getXP } from 'actions/profile';
import { useDispatch, useSelector } from 'react-redux';
import { getWeb3Instance } from 'utils/web3EventFn';
import profileAbi from 'contracts/abi/Profile.sol/Profile.json';
import profileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import { profileManageContractAddress } from 'contracts/contracts';
import { GET_PROFILE_CONTRACT_ADDRESS } from 'actions/profile/types';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import { IProfileApiResponse } from 'interfaces/profile';
import { normalizeSkills } from 'utils/normalizeSkills';
import { fillProfileSkillsData } from 'actions/skills';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';

const useProfile = () => {
  const dispatch = useDispatch();

  const fetchOnChainProfileData = async (address: string) => {
    try {
      if (address !== '0x0000000000000000000000000000000000000000' && address) {
        const web3 = getWeb3Instance();
        const contract = new web3.eth.Contract(
          profileAbi.abi as AbiItem[],
          address
        );
        const xp = await contract.methods.totalXp().call();
        const usdc = await contract.methods.usdc().call();
        dispatch(getXP(xp));
        dispatch(getUSDCBalance(usdc));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getProfileContractAddress = async (address: string | undefined) => {
    try {
      const web3 = getWeb3Instance();
      const profileManageContract = new web3.eth.Contract(
        profileManageAbi.abi as AbiItem[],
        profileManageContractAddress
      );
      const result = await profileManageContract.methods
        .getProfileContractAddress(address)
        .call();
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
      const skillsData = normalizeSkills(json.profileSkills);
      dispatch(fillProfileData(json));
      dispatch(fillProfileSkillsData(skillsData));
    },
    {
      retry: 1,
      enabled:
        user !== undefined &&
        profileId !== undefined &&
        user.userId !== parseInt(profileId, 10),
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch profile data',
        });
      },
    }
  );
};

export { useProfile, useFetchPublicProfile };
