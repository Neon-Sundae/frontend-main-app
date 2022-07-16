import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
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

const useFetchTaskData = (taskId: number | undefined) => {
    if (taskId) {
        const { data } = useQuery(
            'task_detail',
            async () => {
                const response = await fetch(
                    `${config.ApiBaseUrl}/task/${taskId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const json = await handleApiErrors(response);
                return json;
            },
            {
                retry: 1,
                refetchOnWindowFocus: false,
                onError: (error: any) => {
                    handleError({
                        error,
                        explicitMessage: 'Unable to fetch task data',
                    });
                },
            }
        );
        return { taskData: data };
    }
    return { taskData: null };
};

const useSelectBuilder = () => {

    const [pending, setPending] = useState('initial');

    const walletId = useSelector((state: RootState) => state.user.user?.walletId);

    const selectBuilder = async (projectAddress: string, builderAddress: string, taskName: string, price: number, xp: number) => {
        try {
            setPending('waiting');
            const web3 = getWeb3Instance();

            const taskContract = new web3.eth.Contract(TaskAbi.abi as AbiItem[], taskContractAddress);
            const result = await taskContract.methods.createTask(projectAddress, builderAddress, taskName, web3.utils.toWei(String(price), 'ether'), xp)
                .send({ from: walletId });
            const taskId = result.events.TaskCreated.returnValues.taskId;

            const projectContract = new web3.eth.Contract(ProjectAbi.abi as AbiItem[], projectAddress);
            await projectContract.methods.addTask(taskId, taskContractAddress).send({ from: walletId });
            setPending('confirmed');
        } catch (err) {
            console.log(err);
            setPending('failed');
            toast.error('Error happens while confirming transaction');
        }
    }

    return { selectBuilder, pending }
}

export { useFetchTaskData, useSelectBuilder };