import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import config from 'config';

const getFounderFromProject = async (
  projectAddress: string
): Promise<string> => {
  try {
    const web3 = getWeb3Instance();

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
