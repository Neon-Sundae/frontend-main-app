import { FNDRAddress } from 'contracts/contracts';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { AbiItem } from 'web3-utils';
import toast from 'react-hot-toast';
import { RootState } from 'reducers';
import { getWeb3Instance } from 'utils/web3EventFn';
import FNDRAbi from 'contracts/abi/FNDR.sol/FNDR.json';
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import { useUpdateTaskStatus } from 'components/TaskManagement/hooks';
import getFndrBalance from 'utils/contractFns/getFndrBalance';

const useCommitToTask = () => {
  const updateTask = useUpdateTaskStatus();

  const [pending, setPending] = useState('initial');
  const [hash, setHash] = useState('');
  const [fndrBalance, setFNDRBalance] = useState<number>(0);

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedTask } = useSelector((state: RootState) => state.flProject);

  /**
   * TODO - Proxy contract
   * replace taskContractAddress with taskProjectAddress
   */
  const commitToTask = async (taskId: number, amount: number) => {
    try {
      const web3 = getWeb3Instance();

      const FNDRContract = new web3.eth.Contract(
        FNDRAbi.abi as AbiItem[],
        FNDRAddress
      );
      const balance = await FNDRContract.methods.balanceOf(walletId).call();
      if (balance >= amount * Math.pow(10, 6)) {
        FNDRContract.methods
          .approve(
            taskContractAddress,
            Number(amount * Math.pow(10, 6)).toFixed(0)
          )
          .send({ from: walletId })
          .on('transactionHash', (hash: any) => {
            setHash(hash);
            setPending('approving');
          })
          .on('receipt', (receipt: any) => {
            setPending('confirming');
            const taskContract = new web3.eth.Contract(
              TaskAbi.abi as AbiItem[],
              taskContractAddress
            );
            // TODO: should use task token id not taskId of db.
            taskContract.methods
              .commitToTask(taskId, Number(amount * Math.pow(10, 6)).toFixed(0))
              .send({ from: walletId })
              .on('transactionHash', (hash: any) => {
                setHash(hash);
                setPending('confirming');
              })
              .on('receipt', async (receipt: any) => {
                setPending('confirmed');
                await updateTask.mutateAsync({
                  taskId: selectedTask?.taskId,
                  status: 'in progress',
                });
              })
              .on('error', (err: any) => {
                setPending('failed');
              });
          })
          .on('error', (err: any) => {
            setPending('failed');
          });
      } else {
        toast.error('Insufficient FNDR balance');
      }
    } catch (err) {
      console.log(err);
      toast.error('Error happens while confirming transaction');
      setPending('failed');
    }
  };

  const getFNDRBalance = async () => {
    try {
      if (walletId) {
        const balance = await getFndrBalance(walletId);
        setFNDRBalance(Number(Number(balance).toFixed(4)));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return { commitToTask, pending, hash, fndrBalance, getFNDRBalance };
};

export default useCommitToTask;
