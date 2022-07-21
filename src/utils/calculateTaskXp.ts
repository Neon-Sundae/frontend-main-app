import { AbiItem } from "web3-utils";
import toast from "react-hot-toast";
import { getWeb3Instance } from "./web3EventFn";
import ProfileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import ProfileAbi from 'contracts/abi/Profile.sol/Profile.json';
import { profileManageContractAddress } from "contracts/contracts";

const calculateTaskXP = async (walletId: string | undefined, taskDifficulty: number) => {
  try {
    const web3 = getWeb3Instance();
    const profileManageContract = new web3.eth.Contract(ProfileManageAbi.abi as AbiItem[], profileManageContractAddress);
    const profileAddress = await profileManageContract.methods.getProfileContractAddress(walletId).call();
    if (profileAddress === '0x0000000000000000000000000000000000000000') {
      toast.error('Please deploy your profile on chain first');
      return 0;
    }
    const profileContract = new web3.eth.Contract(ProfileAbi.abi as AbiItem[], profileAddress);
    const totalXP = await profileContract.methods.totalXp().call();

    const LEVEL_INCREMENTOR = 1000;
    const LEVEL_20 = 20 * LEVEL_INCREMENTOR;
    const LEVEL_50 = 50 * LEVEL_INCREMENTOR;

    let taskXP = (taskDifficulty + 10) ** 2 + (taskDifficulty - 2) * 50;

    if (totalXP < LEVEL_20) {
      taskXP += 45;
    }

    if (totalXP < LEVEL_50) {
      taskXP += 45;
    }

    return Number(taskXP);
  } catch (err) {
    console.log(err);
  }
};

export default calculateTaskXP;
