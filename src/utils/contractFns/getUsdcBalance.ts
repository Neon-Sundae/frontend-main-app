import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import USDCAbi from 'contracts/abi/USDC.sol/USDC.json';
import { USDCAddress } from 'contracts/contracts';

const getUsdcBalance = async (address: string | undefined) => {
  try {
    if (!address) return 0;

    const web3 = getWeb3Instance();

    const USDCContract = new web3.eth.Contract(
      USDCAbi.abi as AbiItem[],
      USDCAddress
    );
    const balance = await USDCContract.methods.balanceOf(address).call();

    return balance / 10 ** 6;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the USDC balance');
  }
};

export default getUsdcBalance;
