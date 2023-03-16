import { AbiItem } from 'web3-utils';
import ProfileAbi from 'contracts/abi/Profile.sol/Profile.json';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

const getProfileDetails = async (
  profileAddress: string,
  auth: AuthContextType
) => {
  try {
    const web3: any = arcanaWeb3InstanceFunc(auth);

    const ProfileContract = new web3.eth.Contract(
      ProfileAbi.abi as AbiItem[],
      profileAddress
    );

    const ownerPromise = ProfileContract.methods.owner().call();
    const namePromise = ProfileContract.methods.name().call();
    const titlePromise = ProfileContract.methods.title().call();
    const totalXpPromise = ProfileContract.methods.totalXp().call();
    const usdcPromise = ProfileContract.methods.usdc().call();

    const resultArray = await Promise.all([
      ownerPromise,
      namePromise,
      titlePromise,
      totalXpPromise,
      usdcPromise,
    ]);

    return [...resultArray];
  } catch (error) {
    console.log(error);
    throw new Error('Contract function: Failed to get profile details');
  }
};

export default getProfileDetails;
