import { AbiItem } from 'web3-utils';
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import { Dispatch, SetStateAction } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { IUpdateTaskStatus } from 'components/TaskManagement/hooks';
import config from 'config';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

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
  const web3: any = await arcanaWeb3InstanceFunc(auth);

  try {
    if (!walletId) throw new Error('Unable to complete the task');

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
