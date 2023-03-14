import { AbiItem } from 'web3-utils';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';
import ProfileAbi from 'contracts/abi/Profile.sol/Profile.json';
import { SetStateAction, Dispatch } from 'react';
import toast from 'react-hot-toast';
import estimateGasPrice from 'utils/estimateGasFees';
import { AuthContextType } from '@arcana/auth-react/types/typings';

const withdrawProfileBalance = async (
  amount: number,
  contractAddress: string,
  userAddress: string,
  setDeploying: Dispatch<SetStateAction<string>>,
  auth: AuthContextType
) => {
  const arcanaWeb3Instance = await getArcanaWeb3Instance(auth);
  let web3;
  if (arcanaWeb3Instance) {
    web3 = arcanaWeb3Instance;
  } else {
    web3 = getWeb3Instance();
  }
  const gasPrice = await estimateGasPrice(web3);

  const withdrawAmount = amount * 10 ** 6;

  const ProfileContract = new web3.eth.Contract(
    ProfileAbi.abi as AbiItem[],
    contractAddress,
    {
      gasPrice,
    }
  );

  await ProfileContract.methods
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

export default withdrawProfileBalance;
