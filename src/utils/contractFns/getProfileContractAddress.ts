import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileFactoryAbi from 'contracts/abi/ProfileFactory.sol/ProfileFactory.json';
import config from 'config';

const getProfileContractAddress = async (address: string | undefined) => {
  try {
    if (!address) return null;

    const web3 = getWeb3Instance();

    const ProfileFactory = new web3.eth.Contract(
      ProfileFactoryAbi.abi as AbiItem[],
      config.profileFactoryAddress
    );
    const profileContractAddress = await ProfileFactory.methods
      .ownerToProfileAddress(address)
      .call();

    return profileContractAddress;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the profile contract address');
  }
};

export default getProfileContractAddress;
