import { AbiItem } from 'web3-utils';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';
import FNDRAbi from 'contracts/abi/FNDR.sol/FNDR.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';

const getFndrBalance = async (
  address: string | undefined,
  auth: AuthContextType
) => {
  let arcanaWeb3Instance;
  if (auth.isLoggedIn) arcanaWeb3Instance = await getArcanaWeb3Instance(auth);
  else arcanaWeb3Instance = null;

  try {
    if (!address) return 0;

    let web3;
    if (arcanaWeb3Instance) {
      web3 = arcanaWeb3Instance;
    } else {
      web3 = getWeb3Instance();
    }

    console.log('Getting FNDR balance');

    const FndrContract = new web3.eth.Contract(
      FNDRAbi.abi as AbiItem[],
      config.FNDRAddress
    );
    const balance = await FndrContract.methods.balanceOf(address).call();

    return balance / 10 ** 4;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get the FNDR balance');
  }
};

export default getFndrBalance;
