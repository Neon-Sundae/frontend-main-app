import { AbiItem } from 'web3-utils';
import { getUSDCBalance, getXP } from 'actions/profile';
import { useDispatch } from 'react-redux';
import { getWeb3Instance } from 'utils/web3EventFn';
import profileAbi from 'contracts/abi/Profile.sol/Profile.json';
import profileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import { profileManageContractAddress } from 'contracts/contracts';
import { GET_PROFILE_CONTRACT_ADDRESS } from 'actions/profile/types';

const useProfile = () => {
  const dispatch = useDispatch();

  const fetchOnChainProfileData = async (address: string) => {
    try {
      if (
        address !== '0x0000000000000000000000000000000000000000' &&
        address !== ''
      ) {
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

export default useProfile;
