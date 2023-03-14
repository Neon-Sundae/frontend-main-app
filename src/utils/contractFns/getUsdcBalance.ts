import { AbiItem } from 'web3-utils';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';
import USDCAbi from 'contracts/abi/USDC.sol/USDC.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';

const getUsdcBalance = async (
  address: string | undefined,
  auth: AuthContextType
) => {
  const arcanaWeb3Instance = await getArcanaWeb3Instance(auth);

  try {
    if (!address) return 0;

    let web3;
    if (arcanaWeb3Instance) {
      web3 = arcanaWeb3Instance;
    } else {
      web3 = getWeb3Instance();
    }

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
