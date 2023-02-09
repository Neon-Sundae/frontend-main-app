import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileAbi from 'contracts/abi/Profile.sol/Profile.json';

const getProfileDetails = async (profileAddress: string) => {
  try {
    const web3 = getWeb3Instance();

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
