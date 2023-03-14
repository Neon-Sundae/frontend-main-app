import { AbiItem } from 'web3-utils';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';

const getFounderFromProject = async (
  projectAddress: string,
  auth: AuthContextType
): Promise<string> => {
  const arcanaWeb3Instance = await getArcanaWeb3Instance(auth);

  try {
    let web3;
    if (arcanaWeb3Instance) {
      web3 = arcanaWeb3Instance;
    } else {
      web3 = getWeb3Instance();
    }
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
