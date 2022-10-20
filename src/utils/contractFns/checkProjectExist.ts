import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import { projectFactoryAddress } from 'contracts/contracts';

const checkProjectExist = async (
  walletId: string | undefined,
  projectId: string
): Promise<boolean | null> => {
  try {
    if (!walletId) return null;

    const web3 = getWeb3Instance();

    const ProjectFactory = new web3.eth.Contract(
      ProjectFactoryAbi.abi as AbiItem[],
      projectFactoryAddress
    );
    const projects = await ProjectFactory.methods
      .checkProjectExist(walletId, projectId)
      .call();

    return projects;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the projects');
  }
};

export default checkProjectExist;
