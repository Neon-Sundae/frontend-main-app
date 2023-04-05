import { getUSDCBalance, getXP } from 'actions/profile';
import { useDispatch } from 'react-redux';
import { GET_PROFILE_CONTRACT_ADDRESS } from 'actions/profile/types';
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

export { useProfile };
