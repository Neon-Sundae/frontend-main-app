import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import { projectFactoryAddress } from 'contracts/contracts';

interface IProjectInfo {
  contractAddress: string;
  projectId: string;
}

const getAllProjects = async (
  founderAddress: string
): Promise<IProjectInfo[]> => {
  try {
    const web3 = getWeb3Instance();

    const ProjectFactory = new web3.eth.Contract(
      ProjectFactoryAbi.abi as AbiItem[],
      projectFactoryAddress
    );
    const projects = await ProjectFactory.methods
      .ownerToProfileAddress(founderAddress)
      .call();

    return projects;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the projects');
  }
};

export default getAllProjects;
