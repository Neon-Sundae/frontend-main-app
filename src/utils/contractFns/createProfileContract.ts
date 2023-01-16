import { getEthersInstance } from 'utils/web3EventFn';
import ProfileFactoryAbi from 'contracts/abi/ProfileFactory.sol/ProfileFactory.json';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { ethers } from 'ethers';

const createProfileContract = async (
  address: string | undefined,
  name: string | undefined,
  title: string | undefined,
  deploying: string,
  setDeploying: Dispatch<SetStateAction<string>>
) => {
  try {
    if (!address || !name || !title)
      throw new Error('Unable to create profile');

    const provider = getEthersInstance();
    const signer = provider.getSigner();

    const ProfileFactory = new ethers.Contract(
      config.profileFactoryAddress,
      ProfileFactoryAbi.abi,
      signer
    );

    setDeploying('deploying');

    const result = await ProfileFactory.createProfile(
      config.USDCAddress,
      name,
      title,
      {
        gasPrice: '50000000000',
      }
    );

    const response = await result.wait();

    return response.events[0].address;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default createProfileContract;
