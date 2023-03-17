import { AbiItem } from 'web3-utils';
import FNDRAbi from 'contracts/abi/FNDR.sol/FNDR.json';
import config from 'config';
import { AuthContextType } from '@arcana/auth-react/types/typings';
import arcanaWeb3InstanceFunc from 'utils/arcanaWeb3Instance';

const getFndrBalance = async (
  address: string | undefined,
  auth: AuthContextType
) => {
  const web3: any = await arcanaWeb3InstanceFunc(auth);

  try {
    if (!address) return 0;

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
