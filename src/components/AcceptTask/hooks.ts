import { Dispatch, SetStateAction, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import config from 'config';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import { RootState } from 'reducers';
import { getAccessToken } from 'utils/authFn';
import {
  SET_ACCEPTED_BUILDER,
  SET_REJECTED_BUILDER,
} from 'actions/flProject/types';
import { useUpdateTaskStatus } from 'components/TaskManagement/hooks';
import cancelTaskOnChain from 'utils/contractFns/cancelTaskOnChain';
import createTaskOnChain from 'utils/contractFns/createTaskOnChain';
import fundProjectTaskContract from 'utils/contractFns/fundProjectTaskContract';

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
    projectTaskAddress: string
  ) => {
    try {
      setPending('waiting');
      const tokenId = await createTaskOnChain({
        projectTaskAddress,
        price,
        projectAddress,
        taskName,
        walletId: builderInfo?.Profile?.user?.walletId,
        xp,
      });

      await fundProjectTaskContract(price, walletId, projectAddress);

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

  const saveTaskTokenId = async (taskId: number, tokenId: string | null) => {
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

const useCancelTask = () => {
  const accessToken = getAccessToken();

  const updateTask = useUpdateTaskStatus();
  const [success, setSuccess] = useState(false);

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedTask, projectTaskAddress } = useSelector(
    (state: RootState) => state.flProject
  );

  const acceptedBuilder = selectedTask?.profileTask.filter(
    (builder: any) => builder.applicationStatus === 'accepted'
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
        await cancelTaskOnChain({
          projectTaskAddress,
          selectedTask,
          walletId,
          builder: acceptedBuilder[0],
        });

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
  useUpdateTaskChecklist,
  useCancelTask,
  useDeleteTask,
};
