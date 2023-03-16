import { AbiItem } from 'web3-utils';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

const getFounderFromProject = async (
  projectAddress: string,
  auth: AuthContextType
): Promise<string> => {
  const web3: any = arcanaWeb3InstanceFunc(auth);

  try {
    const ProjectFactory = new web3.eth.Contract(
      ProjectFactoryAbi.abi as AbiItem[],
      config.projectFactoryAddress
    );
    const foundersAddress = await ProjectFactory.methods
      .getFounderFromProjectAddress(projectAddress)
      .call();

    return foundersAddress;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the projects');
  }
};

export default getFounderFromProject;
