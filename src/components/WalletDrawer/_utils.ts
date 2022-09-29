/* eslint-disable import/prefer-default-export */
import getUsdcBalance from 'utils/contractFns/getUsdcBalance';

const getContractAvailableBalance = async (contractObject: any) => {
  if (contractObject && contractObject.smartContractId) {
    const balance = await getUsdcBalance(contractObject.smartContractId);
    return balance;
  }

  return 0;
};

export { getContractAvailableBalance };
