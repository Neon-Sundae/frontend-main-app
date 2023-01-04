import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileFactoryAbi from 'contracts/abi/ProfileFactory.sol/ProfileFactory.json';
import config from 'config';

const getProfileContractAddress = async (address: string | undefined) => {
  try {
    if (!address) throw new Error('Address not found');

    const web3 = getWeb3Instance();

    console.log('getting profile contract address');

    const ProfileFactory = new web3.eth.Contract(
      ProfileFactoryAbi.abi as AbiItem[],
      config.profileFactoryAddress,
      {
        gasPrice: '50000000000',
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
