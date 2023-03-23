/* eslint-disable import/prefer-default-export */
import { AuthContextType } from '@arcana/auth-react/types/typings';
import getUsdcBalance from 'utils/contractFns/getUsdcBalance';

const getContractAvailableBalance = async (
  contractObject: any,
  auth: AuthContextType
) => {
  if (contractObject && contractObject.smartContractId) {
    const balance = await getUsdcBalance(contractObject.smartContractId, auth);
    return balance;
  }

  return 0;
};

export { getContractAvailableBalance };
