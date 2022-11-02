import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileFactoryAbi from 'contracts/abi/ProfileFactory.sol/ProfileFactory.json';
import { profileFactoryAddress, USDCAddress } from 'contracts/contracts';

const createProfileContract = async (
  address: string | undefined,
  name: string | undefined,
  title: string | undefined
) => {
  try {
    if (!address || !name || !title)
      throw new Error('Unable to create profile');

    const web3 = getWeb3Instance();

    const ProfileFactory = new web3.eth.Contract(
      ProfileFactoryAbi.abi as AbiItem[],
      profileFactoryAddress
    );
    await ProfileFactory.methods
      .createProfile(USDCAddress, name, title)
      .send({ from: address });
  } catch (error) {
    console.log(error);
    throw new Error('Unable to create profile');
  }
};

export default createProfileContract;
