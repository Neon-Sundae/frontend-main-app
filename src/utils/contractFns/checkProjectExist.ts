import { AbiItem } from 'web3-utils';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';

const checkProjectExist = async (
  walletId: string | undefined,
  projectId: string,
  auth: AuthContextType
): Promise<boolean | null> => {
  const arcanaWeb3Instance = await getArcanaWeb3Instance(auth);

  try {
    if (!walletId) return null;

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
    const exists = await ProjectFactory.methods
      .checkProjectExist(walletId, projectId)
      .call();

    return exists;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the projects');
  }
};

export default checkProjectExist;
