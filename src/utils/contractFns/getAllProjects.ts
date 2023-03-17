import { AbiItem } from 'web3-utils';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

interface IProjectInfo {
  contractAddress: string;
  projectId: string;
}

const getAllProjects = async (
  founderAddress: string,
  auth: AuthContextType
): Promise<IProjectInfo[]> => {
  const web3: any = await arcanaWeb3InstanceFunc(auth);

  try {
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
