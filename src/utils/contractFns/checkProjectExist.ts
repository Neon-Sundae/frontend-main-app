import { AbiItem } from 'web3-utils';
import ProjectFactoryAbi from 'contracts/abi/ProjectFactory.sol/ProjectFactory.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

const checkProjectExist = async (
  walletId: string | undefined,
  projectId: string,
  auth: AuthContextType
): Promise<boolean | null> => {
  const web3: any = await arcanaWeb3InstanceFunc(auth);

  try {
    if (!walletId) return null;

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
