import { AbiItem } from 'web3-utils';
import { useDispatch, useSelector } from 'react-redux';
import { getWeb3Instance } from 'utils/web3EventFn';
import profileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import { profileManageContractAddress, USDCAddress } from 'contracts/contracts';
import config from 'config';
// import { IProfileSmartContractApiResponse } from 'interfaces/profile';
import { GET_PROFILE_CONTRACT_ADDRESS } from 'actions/profile/types';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import toast from 'react-hot-toast';
import { updateProfileContractAddressAction } from 'actions/profile';

const useProfileManage = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.user?.userId);

  const accessToken = getAccessToken();

  const createProfile = async (
    name: string | null | undefined,
    title: string | null | undefined,
    address: string | undefined
  ) => {
    try {
      const web3 = getWeb3Instance();
      const profileManageContract = new web3.eth.Contract(
        profileManageAbi.abi as AbiItem[],
        profileManageContractAddress
      );

      const isContractDeployed = await profileManageContract.methods
        .getProfileContractAddress(address)
        .call();

      if (isContractDeployed !== '0x0000000000000000000000000000000000000000') {
        await saveProfileContractAddress(isContractDeployed);
        return;
      }

      if (name === null || title === null) {
        toast.error('Profile name or title is empty.');
        return;
      }

      await profileManageContract.methods
        .createProfile(USDCAddress, name, title)
        .send({ from: address });

      const contractAddress = await profileManageContract.methods
        .getProfileContractAddress(address)
        .call();
      console.log('Deployed profile contract address: ', contractAddress);
      dispatch({
        type: GET_PROFILE_CONTRACT_ADDRESS,
        payload: contractAddress,
      });
      await saveProfileContractAddress(contractAddress);
    } catch (err) {
      console.log(err);
    }
  };

  const saveProfileContractAddress = async (address: string) => {
    try {
      const ac = new AbortController();
      const { signal } = ac;

      const payload = {
        profileSmartContractId: address,
      };
      const response = await fetch(`${config.ApiBaseUrl}/profile/${userId}`, {
        signal,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      await handleApiErrors(response);
      dispatch(updateProfileContractAddressAction(address));
    } catch (err) {
      console.log(err);
    }
  };

  return { createProfile };
};

export default useProfileManage;
