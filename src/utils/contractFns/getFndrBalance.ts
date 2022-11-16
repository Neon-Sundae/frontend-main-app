import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import FNDRAbi from 'contracts/abi/FNDR.sol/FNDR.json';
import config from 'config';

const getFndrBalance = async (address: string | undefined) => {
  try {
    if (!address) return 0;

    const web3 = getWeb3Instance();

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
