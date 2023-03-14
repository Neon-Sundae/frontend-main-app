import { AbiItem } from 'web3-utils';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';

interface IProjectInfo {
  contractAddress: string;
  projectId: string;
}

const getAllProjects = async (
  founderAddress: string,
  auth: AuthContextType
): Promise<IProjectInfo[]> => {
  const arcanaWeb3Instance = await getArcanaWeb3Instance(auth);

  try {
    let web3;
    if (arcanaWeb3Instance) {
      web3 = arcanaWeb3Instance;
    } else {
      web3 = getWeb3Instance();
    }

    console.log('getting all projects from chain');

    const ProjectFactory = new web3.eth.Contract(
      ProjectFactoryAbi.abi as AbiItem[],
      config.projectFactoryAddress
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
