import { AbiItem } from 'web3-utils';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { AnyAction } from 'redux';
import { GET_SELECTED_PROJECT_ADDRESS } from 'actions/flProject/types';
import toast from 'react-hot-toast';
import saveProjectContractAddress from 'hooks/saveProjectContractAddress';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

interface ICreateProjectContract {
  projectId: string;
  walletId: string | undefined;
  setDeploying: Dispatch<SetStateAction<string>>;
  dispatch: Dispatch<AnyAction>;
  auth: AuthContextType;
}

const createProjectContract = async ({
  projectId,
  walletId,
  dispatch,
  setDeploying,
  auth,
}: ICreateProjectContract) => {
  const web3: any = await arcanaWeb3InstanceFunc(auth);

  try {
    if (!walletId) throw new Error('Unable to create project');

    const gasPrice = await estimateGasPrice(web3);

    const ProjectFactory = new web3.eth.Contract(
      ProjectFactoryAbi.abi as AbiItem[],
      config.projectFactoryAddress,
      {
        gasPrice,
      }
    );

    const result = await ProjectFactory.methods
      .createProject(projectId, config.USDCAddress)
      .send({ from: walletId })
      .on('transactionHash', () => {
        setDeploying('deploying');
      })
      .on('receipt', async (receipt: any) => {
        setDeploying('deploy_success');
        const projectContractAddress =
          receipt.events.DeployedNewProject.returnValues[1];

        await saveProjectContractAddress(
          { smartContractId: projectContractAddress },
          projectId
        );

        dispatch({
          type: GET_SELECTED_PROJECT_ADDRESS,
          payload: projectContractAddress,
        });
      })
      .on('error', (err: any) => {
        console.log(err);
        toast.error('Error happens while deploying contract');
        setDeploying('go_live');
      });

    const projectAddress = result.events.DeployedNewProject.returnValues[1];

    return projectAddress;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the projects');
  }
};

export default createProjectContract;
