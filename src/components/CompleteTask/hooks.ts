import { FNDRAddress, taskContractAddress } from "contracts/contracts";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AbiItem } from "web3-utils";
import { RootState } from "reducers";
import { getWeb3Instance } from "utils/web3EventFn";
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import FNDRAbi from 'contracts/abi/FNDR.sol/FNDR.json';
import { useUpdateTaskStatus } from "components/TaskManagement/hooks";

const useCompleteTask = () => {

    const updateTask = useUpdateTaskStatus();

    const [pending, setPending] = useState('initial');
    const walletId = useSelector((state: RootState) => state.user.user?.walletId);
    const { selectedTask } = useSelector((state: RootState) => state.flProject);

    const completeTask = (tokenId: number) => {
        try {
            const web3 = getWeb3Instance();
            const FNDRContract = new web3.eth.Contract(FNDRAbi.abi as AbiItem[], FNDRAddress);
            console.log(FNDRContract);
            const taskContract = new web3.eth.Contract(TaskAbi.abi as AbiItem[], taskContractAddress);
            taskContract.methods.completeTask(tokenId)
                .send({ from: walletId })
                .on('transactionHash', (hash: any) => {
                    setPending('confirming');
                })
                .on('receipt', async (receipt: any) => {
                    setPending('confirmed');
                    await updateTask.mutateAsync({
                        taskId: selectedTask?.taskId,
                        status: 'completed'
                    });
                })
                .on('error', (err: any) => {
                    setPending('failed');
                })
        } catch (err) {
            console.log(err);
        }
    }
    return { completeTask, pending, setPending }
}

export default useCompleteTask;