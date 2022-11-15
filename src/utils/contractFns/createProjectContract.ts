import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { AnyAction } from 'redux';
import { GET_SELECTED_PROJECT_ADDRESS } from 'actions/flProject/types';
import toast from 'react-hot-toast';
import saveProjectContractAddress from 'hooks/saveProjectContractAddress';

interface ICreateProjectContract {
  projectId: string;
  walletId: string | undefined;
  setDeploying: Dispatch<SetStateAction<string>>;
  dispatch: Dispatch<AnyAction>;
}

const createProjectContract = async ({
  projectId,
  walletId,
  dispatch,
  setDeploying,
}: ICreateProjectContract) => {
  try {
    if (!walletId) throw new Error('Unable to create project');

    const web3 = getWeb3Instance();

    const ProjectFactory = new web3.eth.Contract(
      ProjectFactoryAbi.abi as AbiItem[],
      config.projectFactoryAddress
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
