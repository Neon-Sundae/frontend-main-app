import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import createProfileContract from 'utils/contractFns/createProfileContract';
import config from 'config';
import { GET_PROFILE_CONTRACT_ADDRESS } from 'actions/profile/types';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import toast from 'react-hot-toast';
import { updateProfileContractAddressAction } from 'actions/profile';
import getProfileContractAddress from 'utils/contractFns/getProfileContractAddress';
import errorEventBeacon from 'utils/analyticsFns/errorEventBeacon';

const useProfileManage = () => {
  const dispatch = useDispatch();
  const [deploying, setDeploying] = useState('mint');
  const user = useSelector((state: RootState) => state.user.user);

  const accessToken = getAccessToken();

  const createProfile = async (
    name: string | null | undefined,
    title: string | null | undefined,
    address: string | undefined
  ) => {
    try {
      const isContractDeployed = await getProfileContractAddress(address);

      if (isContractDeployed !== '0x0000000000000000000000000000000000000000') {
        await saveProfileContractAddress(isContractDeployed);
        return;
      }

      if (!name || !title) {
        toast.error('Profile name or title is empty.');
        return;
      }

      await createProfileContract(
        address,
        name,
        title,
        deploying,
        setDeploying
      );

      const contractAddress = await getProfileContractAddress(address);
      console.log('Deployed profile contract address: ', contractAddress);
      dispatch({
        type: GET_PROFILE_CONTRACT_ADDRESS,
        payload: contractAddress,
      });
      await saveProfileContractAddress(contractAddress);
      setDeploying('minted');
    } catch (err: any) {
      errorEventBeacon(user?.walletId, err.message);
    }
  };

  const saveProfileContractAddress = async (address: string) => {
    try {
      const ac = new AbortController();
      const { signal } = ac;

      const payload = {
        profileSmartContractId: address,
      };
      const response = await fetch(
        `${config.ApiBaseUrl}/profile/${user?.userId}`,
        {
          signal,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
      dispatch(updateProfileContractAddressAction(address));
    } catch (err) {
      console.log(err);
    }
  };

  return { createProfile, deploying };
};

export default useProfileManage;
