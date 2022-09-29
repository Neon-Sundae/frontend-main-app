import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';

const withdrawProjectBalance = async (
  amount: number,
  contractAddress: string,
  userAddress: string
) => {
  const web3 = getWeb3Instance();

  const withdrawAmount = amount * 10 ** 6;

  const ProjectContract = new web3.eth.Contract(
    ProjectAbi.abi as AbiItem[],
    contractAddress
  );

  await ProjectContract.methods
    .withdraw(withdrawAmount)
    .send({ from: userAddress });

  return 'Success';
};

export default withdrawProjectBalance;
