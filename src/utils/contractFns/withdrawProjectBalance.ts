import { AbiItem } from 'web3-utils';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';
import { SetStateAction, Dispatch } from 'react';
import toast from 'react-hot-toast';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

const withdrawProjectBalance = async (
  amount: number,
  contractAddress: string,
  userAddress: string,
  setDeploying: Dispatch<SetStateAction<string>>,
  auth: AuthContextType
) => {
  const web3: any = await arcanaWeb3InstanceFunc(auth);

  const gasPrice = await estimateGasPrice(web3);

  const withdrawAmount = amount * 10 ** 6;

  const ProjectContract = new web3.eth.Contract(
    ProjectAbi.abi as AbiItem[],
    contractAddress,
    {
      gasPrice,
    }
  );

  await ProjectContract.methods
    .withdraw(withdrawAmount)
    .send({ from: userAddress })
    .on('transactionHash', () => {
      setDeploying('deploying');
    })
    .on('receipt', async (receipt: any) => {
      setDeploying('deploy_success');
      console.log(JSON.stringify(receipt.events));
    })
    .on('error', async (err: any) => {
      setDeploying('empty');
      toast.error('There is an error');
    });

  return 'Success';
};

export default withdrawProjectBalance;
