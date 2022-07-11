import { AbiItem } from 'web3-utils';
import { fillProfileData, getUSDCBalance, getXP } from 'actions/profile';
import { fillProfileSkillsData } from 'actions/skills';
import config from 'config';
import { IProfileApiResponse } from 'interfaces/profile';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { normalizeSkills } from 'utils/normalizeSkills';
import { getWeb3Instance } from 'utils/web3EventFn';
import profileAbi from 'contracts/abi/Profile.sol/Profile.json';
import profileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import { profileManageContractAddress } from "contracts/contracts";
import { GET_PROFILE_CONTRACT_ADDRESS } from 'actions/profile/types';

const useProfile = () => {

  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.user.user?.userId);
  // const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  const accessToken = getAccessToken();

  const fetchOffChainProfileData = async () => {
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
  };

  const fetchOnChainProfileData = async (address: string) => {
    try {
      if (address !== "0x0000000000000000000000000000000000000000" && address !== "") {
        const web3 = getWeb3Instance();
        const contract = new web3.eth.Contract(profileAbi.abi as AbiItem[], address);
        const xp = await contract.methods.totalXp().call();
        const usdc = await contract.methods.usdc().call();
        dispatch(getXP(xp));
        dispatch(getUSDCBalance(usdc));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getProfileContractAddress = async (address: string | undefined) => {
    try {
      const web3 = getWeb3Instance();
      const profileManageContract = new web3.eth.Contract(profileManageAbi.abi as AbiItem[], profileManageContractAddress);
      const result = await profileManageContract.methods.getProfileContractAddress(address).call();
      dispatch({
        type: GET_PROFILE_CONTRACT_ADDRESS,
        payload: result
      })
    } catch (err) {
      console.log(err);
    }
  }

  return {
    fetchOffChainProfileData,
    fetchOnChainProfileData,
    getProfileContractAddress
  }
};

export default useProfile;
