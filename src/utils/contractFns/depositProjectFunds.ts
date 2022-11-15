import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';
import USDCAbi from 'contracts/abi/USDC.sol/USDC.json';
import config from 'config';

const depositProjectFunds = async (
  amount: number,
  contractAddress: string,
  userAddress: string
) => {
  const web3 = getWeb3Instance();
  const depositAmount = amount * 10 ** 6;

  const USDCContract = new web3.eth.Contract(
    USDCAbi.abi as AbiItem[],
    config.USDCAddress
  );

  const ProjectContract = new web3.eth.Contract(
    ProjectAbi.abi as AbiItem[],
    contractAddress
  );

  await USDCContract.methods
    .approve(contractAddress, depositAmount)
    .send({ from: userAddress });

  await ProjectContract.methods
    .depositFunds(depositAmount)
    .send({ from: userAddress });

  return 'Success';
};

export default depositProjectFunds;
