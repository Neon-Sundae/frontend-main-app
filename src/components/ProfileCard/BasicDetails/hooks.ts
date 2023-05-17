import { useDispatch } from 'react-redux';
import { useState } from 'react';
import createProfileContract from 'utils/contractFns/createProfileContract';
import config from 'config';
import { GET_PROFILE_CONTRACT_ADDRESS } from 'actions/profile/types';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import toast from 'react-hot-toast';
import getProfileContractAddress from 'utils/contractFns/getProfileContractAddress';
import errorEventBeacon from 'utils/analyticsFns/errorEventBeacon';
import { useAuth, useProvider } from '@arcana/auth-react';
import { useUpdateProfileDetails } from 'queries/profile';
import { useFetchUserDetailsByWallet } from 'queries/user';

const useProfileManage = () => {
  const auth = useAuth();

  const { provider: arcanaProvider } = useProvider();

  const dispatch = useDispatch();
  const [deploying, setDeploying] = useState('mint');
  const { data: userData } = useFetchUserDetailsByWallet();
  const updateProfileDetails = useUpdateProfileDetails({
    profileId: userData?.profileId.toString(),
  });

  const accessToken = getAccessToken();

  const createProfile = async (
    name: string | null | undefined,
    title: string | null | undefined,
    address: string | undefined
  ) => {
    try {
      const isContractDeployed = await getProfileContractAddress(address, auth);

      if (
        isContractDeployed !== '0x0000000000000000000000000000000000000000' &&
        isContractDeployed !== 'Failed'
      ) {
        await updateProfileDetails.mutateAsync({
          payload: {
            profileSmartContractId: isContractDeployed,
          },
        });
        return;
      }

      if (!name || !title) {
        toast.error('Profile name or title is empty.');
        return;
      }

      const profileContractAddress = await createProfileContract(
        address,
        name,
        title,
        setDeploying,
        arcanaProvider
      );

      if (isContractDeployed !== 'Failed') {
        dispatch({
          type: GET_PROFILE_CONTRACT_ADDRESS,
          payload: profileContractAddress,
        });
        await saveProfileContractAddress(profileContractAddress);
      }
      setDeploying('minted');
    } catch (err: any) {
      errorEventBeacon(userData?.user?.walletId, err.message);
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
        `${config.ApiBaseUrl}/profile/${userData?.user?.userId}`,
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
    } catch (err) {
      console.log(err);
    }
  };

  return { createProfile, deploying };
};

export default useProfileManage;
