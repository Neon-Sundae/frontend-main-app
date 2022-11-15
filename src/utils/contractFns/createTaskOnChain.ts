/* eslint-disable no-underscore-dangle */
import { getEthersInstance } from 'utils/web3EventFn';
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import { ethers } from 'ethers';

interface ICreateTaskOnChain {
  projectAddress: string;
  projectTaskAddress: string;
  walletId: string | undefined;
  taskName: string;
  price: number;
  xp: number;
}

const createTaskOnChain = async ({
  projectAddress,
  projectTaskAddress,
  walletId,
  taskName,
  price,
  xp,
}: ICreateTaskOnChain) => {
  try {
    if (!walletId) throw new Error('Unable to complete the task');

    const provider = getEthersInstance();
    const signer = provider.getSigner();

    const TaskContract = new ethers.Contract(
      projectTaskAddress,
      TaskAbi.abi,
      signer
    );

    const result = await TaskContract.createTask(
      projectAddress,
      walletId,
      taskName,
      Number(price * 10 ** 6).toFixed(0),
      xp
    );

    const projectTaskTx = await result.wait();

    let tokenId = null;

    for (let i = 0; i < projectTaskTx.events.length; i += 1) {
      if (projectTaskTx.events[i].event === 'TaskCreated') {
        tokenId = Number(projectTaskTx.events[i].args[1]._hex).toString();
      }
    }

    return tokenId;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default createTaskOnChain;
