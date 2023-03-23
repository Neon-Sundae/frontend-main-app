import { getEthersInstance, getWeb3Instance } from 'utils/web3EventFn';
import ProfileFactoryAbi from 'contracts/abi/ProfileFactory.sol/ProfileFactory.json';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { ethers } from 'ethers';
import estimateGasPrice from 'utils/estimateGasFees';
import { MetamaskError } from 'utils/error/MetamaskError';
import { EthereumProvider } from '@arcana/auth';
import { IUser } from 'interfaces/user';
import { AuthContextType } from '@arcana/auth-react/types/typings';

const createProfileContract = async (
  address: string | undefined,
  name: string | undefined,
  title: string | undefined,
  deploying: string,
  setDeploying: Dispatch<SetStateAction<string>>,
  user: Partial<IUser> | undefined,
  arcanaProvider: EthereumProvider,
  auth: AuthContextType
) => {
  const arcanaProviderWrapped = new ethers.providers.Web3Provider(
    arcanaProvider
  );
  try {
    if (!address || !name || !title)
      throw new Error('Unable to create profile');

    const provider = getEthersInstance();
    const web3 = getWeb3Instance();
    let signer = provider.getSigner();
    if (arcanaProviderWrapped) {
      signer = arcanaProviderWrapped.getSigner();
    }

    const gasPrice = await estimateGasPrice(web3);

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
        gasPrice,
      }
    );

    const response = await result.wait();

    return response.events[0].address;
  } catch (error: any) {
    console.log(error);
    throw new MetamaskError({
      code: error.code,
      data: error.data,
      message: error.message,
    });
  }
};

export default createProfileContract;
