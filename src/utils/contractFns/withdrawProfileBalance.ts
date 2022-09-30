import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileAbi from 'contracts/abi/Profile.sol/Profile.json';

const withdrawProfileBalance = async (
  amount: number,
  contractAddress: string,
  userAddress: string
) => {
  const web3 = getWeb3Instance();

  const withdrawAmount = amount * 10 ** 6;

  const ProfileContract = new web3.eth.Contract(
    ProfileAbi.abi as AbiItem[],
    contractAddress
  );

  await ProfileContract.methods
    .withdraw(withdrawAmount)
    .send({ from: userAddress });

  return 'Success';
};

export default withdrawProfileBalance;
