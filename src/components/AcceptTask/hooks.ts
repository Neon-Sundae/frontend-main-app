import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AbiItem } from "web3-utils";
import config from "config";
import { handleApiErrors } from "utils/handleApiErrors";
import { handleError } from "utils/handleUnAuthorization";
import { getWeb3Instance } from "utils/web3EventFn";
import { taskContractAddress } from "contracts/contracts";
import { RootState } from "reducers";
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';
import { getAccessToken } from "utils/authFn";
import { SET_ACCEPTED_BUILDER, SET_REJECTED_BUILDER } from "actions/flProject/types";

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

const useFetchTaskDataOnChain = async (tokenId: number | undefined) => {
    try {
        const web3 = getWeb3Instance();
        const taskContract = new web3.eth.Contract(TaskAbi.abi as AbiItem[], taskContractAddress);
        const result = await taskContract.methods.getTaskById(tokenId).call();
        // console.log(result);
    } catch (err) {
        console.log(err);
    }
}

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

      const taskContract = new web3.eth.Contract(TaskAbi.abi as AbiItem[], taskContractAddress);
      const result = await taskContract.methods.createTask(projectAddress, builderInfo?.Profile?.user?.walletId, taskName, price * Math.pow(10, 6), xp, difficulty)
          .send({ from: walletId });
      const tokenId = result.events.TaskCreated.returnValues.taskId;

      const projectContract = new web3.eth.Contract(
        ProjectAbi.abi as AbiItem[],
        projectAddress
      );
      await projectContract.methods
        .addTask(tokenId, taskContractAddress)
        .send({ from: walletId });

            await saveTaskTokenId(taskId, tokenId);
            await saveAcceptedBuilder(taskId, builderInfo?.profileId, queryClient);
            setPending('confirmed');
    } catch (err: any) {
        setPending('failed');
        toast.error(err?.code === 4001 ? 'MetaMask Tx Signature: User denied transaction signature.' : 'Error happens while confirming transaction');
    }
  }

  const saveTaskTokenId = async (taskId: number, tokenId: number) => {
      try {
          const ac = new AbortController();
          const { signal } = ac;

          const payload = { taskSmartContractId: tokenId }
          const response = await fetch(
              `${config.ApiBaseUrl}/task/contract/${taskId}`,
              {
                  signal,
                  method: 'PATCH',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify(payload)
              }
          );
          await handleApiErrors(response);
      } catch (err) {
          console.log(err);
      }
  }

  const saveAcceptedBuilder = async (taskId: number, profileId: number, queryClient: QueryClient) => {
      try {
          const ac = new AbortController();
          const { signal } = ac;

          const payload = { profileId: Number(profileId), taskId: Number(taskId) }
          const response = await fetch(
              `${config.ApiBaseUrl}/task/acceptBuilder`,
              {
                  signal,
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify(payload)
              }
          );
          await handleApiErrors(response);
          dispatch({
              type: SET_ACCEPTED_BUILDER,
              payload: profileId
          });
          queryClient.invalidateQueries(['projectTasks']);
      } catch (err) {
          console.log(err);
      }
  }

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

export { useFetchTaskData, useFetchTaskDataOnChain, useSelectBuilder };
