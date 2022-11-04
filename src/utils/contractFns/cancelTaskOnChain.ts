import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import TaskAbi from 'contracts/abi/Task.sol/Task.json';

interface ICancelTaskOnChain {
  walletId: string | undefined;
  projectTaskAddress: string;
  selectedTask: any;
  builder: any;
}

const cancelTaskOnChain = async ({
  walletId,
  projectTaskAddress,
  selectedTask,
  builder,
}: ICancelTaskOnChain) => {
  try {
    if (!walletId) throw new Error('Unable to complete the task');

    const web3 = getWeb3Instance();

    const TaskContract = new web3.eth.Contract(
      TaskAbi.abi as AbiItem[],
      projectTaskAddress
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
