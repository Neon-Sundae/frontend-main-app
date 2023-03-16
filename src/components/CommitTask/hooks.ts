import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { RootState } from 'reducers';
import { useUpdateTaskStatus } from 'components/TaskManagement/hooks';
import getFndrBalance from 'utils/contractFns/getFndrBalance';
import commitToTaskOnChain from 'utils/contractFns/commitToTaskOnChain';
import { useAuth } from '@arcana/auth-react';

const useCommitToTask = () => {
  const auth = useAuth();
  const updateTask = useUpdateTaskStatus();

  const [pending, setPending] = useState('initial');
  const [hash, setHash] = useState('');
  const [fndrBalance, setFNDRBalance] = useState<number>(0);

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedTask, projectTaskAddress } = useSelector(
    (state: RootState) => state.flProject
  );
  const profile = useSelector((state: RootState) => state.profile.profile);

  const commitToTask = async (taskId: number, amount: number) => {
    try {
      await commitToTaskOnChain({
        walletId,
        selectedTask,
        updateTask,
        amount,
        projectTaskContractAddress: projectTaskAddress,
        taskId,
        setHash,
        setPending,
        profile,
        auth,
      });
    } catch (err) {
      console.log(err);
      toast.error('Error happens while confirming transaction');
      setPending('failed');
    }
  };

  const getFNDRBalance = async () => {
    try {
      if (walletId) {
        const balance = await getFndrBalance(walletId, auth);
        setFNDRBalance(Number(Number(balance).toFixed(4)));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return { commitToTask, pending, hash, fndrBalance, getFNDRBalance };
};

export default useCommitToTask;
