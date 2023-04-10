import { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { RootState } from 'reducers';
import { useUpdateTaskStatus } from 'components/TaskManagement/hooks';
import getFndrBalance from 'utils/contractFns/getFndrBalance';
import commitToTaskOnChain from 'utils/contractFns/commitToTaskOnChain';
import { useFetchUserDetailsWrapper } from 'queries/user';
import { useFetchProfileDetailsByUserWrapper } from 'queries/profile';

const useCommitToTask = () => {
  const updateTask = useUpdateTaskStatus();

  const [pending, setPending] = useState('initial');
  const [hash, setHash] = useState('');
  const [fndrBalance, setFNDRBalance] = useState<number>(0);

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedTask, projectTaskAddress } = useSelector(
    (state: RootState) => state.flProject
  );

  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsByUserWrapper({
    userId: userData?.user?.userId,
  });

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
        profileSmartContractId: profileData?.profileSmartContractId,
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
