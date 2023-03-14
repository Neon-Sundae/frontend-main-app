import { AbiItem } from 'web3-utils';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import { Dispatch, SetStateAction } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { IUpdateTaskStatus } from 'components/TaskManagement/hooks';
import config from 'config';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';

interface ICompleteTaskOnChain {
  walletId: string | undefined;
  tokenId: number;
  setPending: Dispatch<SetStateAction<string>>;
  selectedTask: any;
  updateTask: UseMutationResult<Response, any, IUpdateTaskStatus, unknown>;
  projectTaskAddress: string;
  auth: AuthContextType;
}

const completeTaskOnChain = async ({
  walletId,
  tokenId,
  selectedTask,
  setPending,
  updateTask,
  projectTaskAddress,
  auth,
}: ICompleteTaskOnChain) => {
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

    console.log('complete task on chian');

    const TaskContract = new web3.eth.Contract(
      TaskAbi.abi as AbiItem[],
      projectTaskAddress,
      {
        gasPrice,
      }
    );

    await TaskContract.methods
      .completeTask(tokenId, config.taskFactoryAddress)
      .send({ from: walletId })
      .on('transactionHash', () => {
        setPending('confirming');
      })
      .on('receipt', async () => {
        setPending('confirmed');
        await updateTask.mutateAsync({
          taskId: selectedTask?.taskId,
          status: 'completed',
        });
      })
      .on('error', () => {
        setPending('failed');
      });
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default completeTaskOnChain;
