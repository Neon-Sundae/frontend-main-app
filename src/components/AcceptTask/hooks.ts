import { Dispatch, SetStateAction, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AbiItem } from 'web3-utils';
import config from 'config';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import { getWeb3Instance } from 'utils/web3EventFn';
import { FNDRAddress } from 'contracts/contracts';
import FNDRAbi from 'contracts/abi/FNDR.sol/FNDR.json';
import { RootState } from 'reducers';
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';
import { getAccessToken } from 'utils/authFn';
import {
  SET_ACCEPTED_BUILDER,
  SET_REJECTED_BUILDER,
} from 'actions/flProject/types';
import { useUpdateTaskStatus } from 'components/TaskManagement/hooks';
import getFndrBalance from 'utils/contractFns/getFndrBalance';

const useFetchTaskData = (taskId: number | undefined) => {
  const { data } = useQuery(
    ['task_detail'],
    async () => {
      const response = await fetch(`${config.ApiBaseUrl}/task/${taskId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await handleApiErrors(response);
      return json;
    },
    {
      retry: 1,
      enabled: !!taskId,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch task data',
        });
      },
    }
  );
  return { taskData: data || null };
};

const useSelectBuilder = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [pending, setPending] = useState('initial');
  const accessToken = getAccessToken();

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  const selectBuilder = async (
    projectAddress: string,
    builderInfo: any,
    taskId: number,
    taskName: string,
    price: number,
    xp: number,
    difficulty: number
  ) => {
    try {
      setPending('waiting');
      const web3 = getWeb3Instance();

      /**
       * TODO Proxy - Modify create task flow
       * Should create Project Task at the time of publishing the project
       * The projectTask address needs to be stored with project because it's used here
       */
      const taskContract = new web3.eth.Contract(
        TaskAbi.abi as AbiItem[],
        taskContractAddress
      );
      console.log(price * Math.pow(10, 6));
      const result = await taskContract.methods
        .createTask(
          projectAddress,
          builderInfo?.Profile?.user?.walletId,
          taskName,
          Number(price * Math.pow(10, 6)).toFixed(0),
          xp,
          difficulty
        )
        .send({ from: walletId });
      const tokenId = result.events.TaskCreated.returnValues.taskId;

      /**
       * TODO Proxy - No need to call this
       */
      const projectContract = new web3.eth.Contract(
        ProjectAbi.abi as AbiItem[],
        projectAddress
      );
      await projectContract.methods
        .addTask(tokenId, taskContractAddress)
        .send({ from: walletId });

      await saveTaskTokenId(taskId, tokenId);
      await saveAcceptedBuilder(taskId, builderInfo?.profileId);
      setPending('confirmed');
    } catch (err: any) {
      setPending('failed');
      toast.error(
        err?.code === 4001
          ? 'MetaMask Tx Signature: User denied transaction signature.'
          : 'Error happens while confirming transaction'
      );
    }
  };

  const saveTaskTokenId = async (taskId: number, tokenId: number) => {
    try {
      const ac = new AbortController();
      const { signal } = ac;

      const payload = { taskSmartContractId: tokenId };
      const response = await fetch(
        `${config.ApiBaseUrl}/task/contract/${taskId}`,
        {
          signal,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
    } catch (err) {
      console.log(err);
    }
  };

  const saveAcceptedBuilder = async (taskId: number, profileId: number) => {
    try {
      const ac = new AbortController();
      const { signal } = ac;

      const payload = { profileId: Number(profileId), taskId: Number(taskId) };
      const response = await fetch(`${config.ApiBaseUrl}/task/acceptBuilder`, {
        signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      await handleApiErrors(response);
      dispatch({
        type: SET_ACCEPTED_BUILDER,
        payload: profileId,
      });
      queryClient.invalidateQueries(['projectTasks']);
    } catch (err) {
      console.log(err);
    }
  };

  const saveRejectedBuilder = async (data: any, taskId: number) => {
    try {
      const ac = new AbortController();
      const { signal } = ac;

      const payload = { profileId: data?.profileId, taskId };
      const response = await fetch(`${config.ApiBaseUrl}/task/rejectBuilder`, {
        signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      await handleApiErrors(response);
      dispatch({
        type: SET_REJECTED_BUILDER,
        payload: data?.profileId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return { selectBuilder, pending, setPending, saveRejectedBuilder };
};

const useCommitToTask = () => {
  const [pending, setPending] = useState('initial');
  const [hash, setHash] = useState('');
  const [fndrBalance, setFNDRBalance] = useState<number>(0);

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  const commitToTask = async (taskId: number, amount: number) => {
    try {
      const web3 = getWeb3Instance();

      /**
       * TODO Proxy - Proxy changes required
       * taskContractAddress to projectTask address because that's where tokens are being stored
       * taskContractAddress to be replaced by projectTaskAddress because it's having task related methods
       */
      const FNDRContract = new web3.eth.Contract(
        FNDRAbi.abi as AbiItem[],
        FNDRAddress
      );
      const balance = await getFndrBalance(walletId);
      if (balance >= web3.utils.toWei(String(amount), 'ether')) {
        FNDRContract.methods
          .approve(
            taskContractAddress,
            web3.utils.toWei(String(amount), 'ether')
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
              .commitToTask(taskId, web3.utils.toWei(String(amount), 'ether'))
              .send({ from: walletId })
              .on('transactionHash', (hash: any) => {
                setHash(hash);
                setPending('confirming');
              })
              .on('receipt', (receipt: any) => {
                setPending('confirmed');
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
    const web3 = getWeb3Instance();

    try {
      const balance = await getFndrBalance(walletId);
      setFNDRBalance(Number(web3.utils.fromWei(String(balance), 'ether')));
    } catch (err) {
      console.log(err);
    }
  };
  return { commitToTask, pending, hash, fndrBalance, getFNDRBalance };
};

interface IUpdateTaskChecklist {
  isCompleted: boolean;
  url: string;
}

const useUpdateTaskChecklist = (taskChecklistId: number) => {
  const accessToken = getAccessToken();

  const updateTaskChecklist = useMutation(
    async (payload: IUpdateTaskChecklist) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/task/checklist/${taskChecklistId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return updateTaskChecklist;
};

/**
 * TODO - Proxy
 * replace taskContractAddress with taskProjectAddress
 */
const useCancelTask = () => {
  const web3 = getWeb3Instance();
  const accessToken = getAccessToken();

  const updateTask = useUpdateTaskStatus();
  const [success, setSuccess] = useState(false);

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedTask } = useSelector((state: RootState) => state.flProject);
  const { selectedProjectAddress } = useSelector(
    (state: RootState) => state.flProject
  );

  const cancelTask = async () => {
    try {
      if (!selectedTask.cancelPermission) {
        const ac = new AbortController();
        const { signal } = ac;

        const payload = { taskId: selectedTask?.taskId };

        const response = await fetch(
          `${config.ApiBaseUrl}/task/cancel/founder`,
          {
            signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          }
        );
        await handleApiErrors(response);
        setSuccess(true);
      } else {
        const taskContract = new web3.eth.Contract(
          TaskAbi.abi as AbiItem[],
          taskContractAddress
        );
        await taskContract.methods
          .cancelTask(selectedTask?.taskSmartContractId)
          .send({ from: walletId });

        await updateTask.mutateAsync({
          taskId: selectedTask?.taskId,
          status: 'cancelled',
        });
      }
    } catch (err) {
      console.log(err);
      setSuccess(false);
    }
  };

  return { cancelTask, success, setSuccess };
};

const useDeleteTask = (setOpen: Dispatch<SetStateAction<boolean>>) => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const deleteTask = useMutation(
    async (taskId: number) => {
      const response = await fetch(`${config.ApiBaseUrl}/task/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      await handleApiErrors(response);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['projectTasks']);
        toast.success('Successfully Deleted');
        setOpen(false);
      },
    }
  );

  return { deleteTask };
};

export {
  useFetchTaskData,
  useSelectBuilder,
  useCommitToTask,
  useUpdateTaskChecklist,
  useCancelTask,
  useDeleteTask,
};
