import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import { profileManageContractAddress } from 'contracts/contracts';

const getProfileContract = async (address: string) => {
  const web3 = getWeb3Instance();

  const ProfileManageContract = new web3.eth.Contract(
    ProfileManageAbi.abi as AbiItem[],
    profileManageContractAddress
  );
  const profileContractAddress = await ProfileManageContract.methods
    .getProfileContractAddress(address)
    .call();

  return profileContractAddress;
};

export default getProfileContract;
