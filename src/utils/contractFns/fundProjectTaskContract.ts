import { AbiItem } from 'web3-utils';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';
import config from 'config';
import toast from 'react-hot-toast';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

const fundProjectTaskContract = async (
  amount: number,
  walletId: string | undefined,
  projectAddress: string,
  auth: AuthContextType
) => {
  const web3: any = await arcanaWeb3InstanceFunc(auth);

  try {
    if (!walletId) throw new Error('Unable to fund project task');

    const gasPrice = await estimateGasPrice(web3);

    // TODO - Instead of this, use ethers.utils.formatUnits(value, noOfDecimals)
    // If the decimals is 18 then ethers.utils.formatEther(value)

    const fundAmount = amount * 10 ** 6;

    const ProjectContract = new web3.eth.Contract(
      ProjectAbi.abi as AbiItem[],
      projectAddress,
      {
        gasPrice,
      }
    );

    await ProjectContract.methods
      .fundProjectTask(config.taskFactoryAddress, projectAddress, fundAmount)
      .send({ from: walletId });
  } catch (error: any) {
    console.log(error);
    toast.error(error.message);
  }
};

export default fundProjectTaskContract;
