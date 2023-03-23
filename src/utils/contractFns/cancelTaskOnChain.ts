import { AbiItem } from 'web3-utils';
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

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
  const web3: any = await arcanaWeb3InstanceFunc(auth);

  try {
    if (!walletId) throw new Error('Unable to complete the task');

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
