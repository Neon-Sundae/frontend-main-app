import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { useUpdateTaskStatus } from 'components/TaskManagement/hooks';
import completeTaskOnChain from 'utils/contractFns/completeTaskOnChain';
import { useAuth } from '@arcana/auth-react';

const useCompleteTask = () => {
  const auth = useAuth();
  const updateTask = useUpdateTaskStatus();

  const [pending, setPending] = useState('initial');
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedTask, projectTaskAddress } = useSelector(
    (state: RootState) => state.flProject
  );

  const completeTask = async (tokenId: number) => {
    try {
      await completeTaskOnChain({
        walletId,
        tokenId,
        selectedTask,
        setPending,
        updateTask,
        projectTaskAddress,
        auth,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return { completeTask, pending, setPending };
};

export default useCompleteTask;
