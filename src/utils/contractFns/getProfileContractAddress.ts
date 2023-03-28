import { AbiItem } from 'web3-utils';
import ProfileFactoryAbi from 'contracts/abi/ProfileFactory.sol/ProfileFactory.json';
import config from 'config';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

const getProfileContractAddress = async (
  address: string | undefined,
  auth: AuthContextType
) => {
  const web3: any = await arcanaWeb3InstanceFunc(auth);

  try {
    if (!address) throw new Error('Address not found');

    const gasPrice = await estimateGasPrice(web3);

    console.log('getting profile contract address');

    const ProfileFactory = new web3.eth.Contract(
      ProfileFactoryAbi.abi as AbiItem[],
      config.profileFactoryAddress,
      {
        gasPrice,
      }
    );
    const profileContractAddress: string = await ProfileFactory.methods
      .ownerToProfileAddress(address)
      .call();

    return profileContractAddress;
  } catch (error) {
    console.log(error);
    return 'Failed';
  }
};

export default getProfileContractAddress;
