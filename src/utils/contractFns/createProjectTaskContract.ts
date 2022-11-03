import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import TaskFactoryAbi from 'contracts/abi/TaskFactory.sol/TaskFactory.json';
import {
  FNDRAddress,
  profileFactoryAddress,
  projectFactoryAddress,
  taskFactoryAddress,
  USDCAddress,
} from 'contracts/contracts';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { setProjectTaskContract } from 'actions/flProject';

interface ICreateProjectContract {
  projectAddress: string;
  walletId: string | undefined;
  dispatch: Dispatch<AnyAction>;
}

const createProjectTaskContract = async ({
  projectAddress,
  walletId,
  dispatch,
}: ICreateProjectContract) => {
  try {
    if (!walletId) throw new Error('Unable to create project task');

    const web3 = getWeb3Instance();

    const TaskFactory = new web3.eth.Contract(
      TaskFactoryAbi.abi as AbiItem[],
      taskFactoryAddress
    );

    const result = await TaskFactory.methods
      .createProjectTask(
        USDCAddress,
        FNDRAddress,
        profileFactoryAddress,
        projectFactoryAddress,
        projectAddress
      )
      .send({
        from: walletId,
      });

    const projectTaskAddress =
      result.events.DeployedNewProjectTask.returnValues[1];

    dispatch(setProjectTaskContract(projectTaskAddress));

    return projectTaskAddress;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the projects');
  }
};

export default createProjectTaskContract;
