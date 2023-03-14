import { AbiItem } from 'web3-utils';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';

interface ICancelTaskOnChain {
  walletId: string | undefined;
  projectTaskAddress: string;
  selectedTask: any;
  builder: any;
  auth: AuthContextType;
}

const cancelTaskOnChain = async ({
  walletId,
  projectTaskAddress,
  selectedTask,
  builder,
  auth,
}: ICancelTaskOnChain) => {
  let arcanaWeb3Instance;
  if (auth.isLoggedIn) arcanaWeb3Instance = await getArcanaWeb3Instance(auth);
  else arcanaWeb3Instance = null;

  try {
    if (!walletId) throw new Error('Unable to complete the task');

    let web3;
    if (arcanaWeb3Instance) {
      web3 = arcanaWeb3Instance;
    } else {
      web3 = getWeb3Instance();
    }

    const gasPrice = await estimateGasPrice(web3);

    const TaskContract = new web3.eth.Contract(
      TaskAbi.abi as AbiItem[],
      projectTaskAddress,
      {
        gasPrice,
      }
    );
    await TaskContract.methods
      .cancelTask(
        selectedTask?.taskSmartContractId,
        builder.Profile.profileSmartContractId
      )
      .send({ from: walletId });
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default cancelTaskOnChain;
