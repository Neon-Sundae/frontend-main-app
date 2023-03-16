import { AbiItem } from 'web3-utils';
import USDCAbi from 'contracts/abi/USDC.sol/USDC.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

const getUsdcBalance = async (
  address: string | undefined,
  auth: AuthContextType
) => {
  const web3: any = arcanaWeb3InstanceFunc(auth);

  try {
    if (!address) return 0;

    const USDCContract = new web3.eth.Contract(
      USDCAbi.abi as AbiItem[],
      config.USDCAddress
    );
    const balance = await USDCContract.methods.balanceOf(address).call();

    // TODO - Instead of this, use ethers.utils.formatUnits(value, noOfDecimals)
    // If the decimals is 18 then ethers.utils.formatEther(value)
    // TODO - Important - Something opposite of the above function

    return balance / 10 ** 6;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the USDC balance');
  }
};

export default getUsdcBalance;
