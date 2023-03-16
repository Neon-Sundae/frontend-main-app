import { AbiItem } from 'web3-utils';
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import FNDRAbi from 'contracts/abi/FNDR.sol/FNDR.json';
import { Dispatch, SetStateAction } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { IUpdateTaskStatus } from 'components/TaskManagement/hooks';
import config from 'config';
import toast from 'react-hot-toast';
import { IProfile } from 'interfaces/profile';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

interface ICommitToTaskOnChain {
  walletId: string | undefined;
  selectedTask: any;
  updateTask: UseMutationResult<Response, any, IUpdateTaskStatus, unknown>;
  amount: number;
  projectTaskContractAddress: string;
  taskId: number;
  setHash: Dispatch<SetStateAction<string>>;
  setPending: Dispatch<SetStateAction<string>>;
  profile: IProfile | null;
  auth: AuthContextType;
}

const commitToTaskOnChain = async ({
  walletId,
  selectedTask,
  updateTask,
  amount,
  projectTaskContractAddress,
  taskId,
  setHash,
  setPending,
  profile,
  auth,
}: ICommitToTaskOnChain) => {
  const web3: any = arcanaWeb3InstanceFunc(auth);

  try {
    if (!walletId && !profile?.profileSmartContractId)
      throw new Error('Unable to commit the task');

    const gasPrice = await estimateGasPrice(web3);

    const payload = {
      walletId,
      selectedTask,
      updateTask,
      amount,
      projectTaskContractAddress,
      taskId,
      setHash,
      setPending,
      profileId: profile?.profileSmartContractId,
    };

    console.log(payload);

    const FNDRContract = new web3.eth.Contract(
      FNDRAbi.abi as AbiItem[],
      config.FNDRAddress
    );
    const balance = await FNDRContract.methods.balanceOf(walletId).call();

    if (balance >= amount * 10 ** 4) {
      await FNDRContract.methods
        .approve(
          projectTaskContractAddress,
          Number(amount * 10 ** 4).toFixed(0)
        )
        .send({ from: walletId })
        .on('transactionHash', (hash: any) => {
          setHash(hash);
          setPending('approving');
        })
        .on('receipt', async () => {
          setPending('confirming');
          const taskContract = new web3.eth.Contract(
            TaskAbi.abi as AbiItem[],
            projectTaskContractAddress,
            {
              gasPrice,
            }
          );
          await taskContract.methods
            .commitToTask(
              taskId,
              Number(amount * 10 ** 4).toFixed(0),
              profile?.profileSmartContractId
            )
            .send({ from: walletId })
            .on('transactionHash', (hash: any) => {
              setHash(hash);
              setPending('confirming');
            })
            .on('receipt', async () => {
              setPending('confirmed');
              await updateTask.mutateAsync({
                taskId: selectedTask?.taskId,
                status: 'in progress',
              });
            })
            .on('error', () => {
              setPending('failed');
            });
        })
        .on('error', () => {
          setPending('failed');
        });
    } else {
      toast.error('Insufficient FNDR balance');
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default commitToTaskOnChain;
