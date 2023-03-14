import { AbiItem } from 'web3-utils';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';
import TaskFactoryAbi from 'contracts/abi/TaskFactory.sol/TaskFactory.json';
import config from 'config';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { setProjectTaskContract } from 'actions/flProject';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';

interface ICreateProjectContract {
  projectAddress: string;
  walletId: string | undefined;
  dispatch: Dispatch<AnyAction>;
  auth: AuthContextType;
}

const createProjectTaskContract = async ({
  projectAddress,
  walletId,
  dispatch,
  auth,
}: ICreateProjectContract) => {
  let arcanaWeb3Instance;
  if (auth.isLoggedIn) arcanaWeb3Instance = await getArcanaWeb3Instance(auth);
  else arcanaWeb3Instance = null;

  try {
    if (!walletId) throw new Error('Unable to create project task');

    let web3;
    if (arcanaWeb3Instance) {
      web3 = arcanaWeb3Instance;
    } else {
      web3 = getWeb3Instance();
    }
    const gasPrice = await estimateGasPrice(web3);

    const TaskFactory = new web3.eth.Contract(
      TaskFactoryAbi.abi as AbiItem[],
      config.taskFactoryAddress,
      {
        gasPrice,
      }
    );

    const result = await TaskFactory.methods
      .createProjectTask(
        config.USDCAddress,
        config.FNDRAddress,
        config.profileFactoryAddress,
        config.projectFactoryAddress,
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
