import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';
import USDCAbi from 'contracts/abi/USDC.sol/USDC.json';
import { USDCAddress } from 'contracts/contracts';
import { SetStateAction, Dispatch } from 'react';
import toast from 'react-hot-toast';

const depositProjectFunds = async (
  amount: number,
  contractAddress: string,
  userAddress: string,
  setDeploying: Dispatch<SetStateAction<string>>
) => {
  const web3 = getWeb3Instance();
  const depositAmount = amount * 10 ** 6;

  const USDCContract = new web3.eth.Contract(
    USDCAbi.abi as AbiItem[],
    USDCAddress
  );

  const ProjectContract = new web3.eth.Contract(
    ProjectAbi.abi as AbiItem[],
    contractAddress
  );

  await USDCContract.methods
    .approve(contractAddress, depositAmount)
    .send({ from: userAddress })
    .on('transactionHash', () => {
      setDeploying('give_usdc_permission');
    })
    .on('receipt', async (receipt: any) => {
      setDeploying('usdc_success');
      console.log(JSON.stringify(receipt.events));
    })
    .on('error', async (err: any) => {
      setDeploying('empty');
      toast.error('There is an error');
    });

  await ProjectContract.methods
    .depositFunds(depositAmount)
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

export default depositProjectFunds;
