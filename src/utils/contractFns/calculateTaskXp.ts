import { AuthContextType } from '@arcana/auth-react/types/typings';
import toast from 'react-hot-toast';
import getProfileContractAddress from './getProfileContractAddress';
import getProfileDetails from './getProfileDetails';

const calculateTaskXP = async (
  walletId: string | undefined,
  taskDifficulty: number,
  auth: AuthContextType
) => {
  try {
    if (!walletId) return null;

    const profileAddress = await getProfileContractAddress(walletId, auth);

    // TODO - Check should be moved in getProfileDetails.ts
    if (profileAddress === '0x0000000000000000000000000000000000000000') {
      toast.error('Please deploy your profile on chain first');
      return 0;
    }

    const [, , totalXP, ,] = await getProfileDetails(profileAddress, auth);

    const LEVEL_INCREMENTOR = 1000;
    const LEVEL_20 = 20 * LEVEL_INCREMENTOR;
    const LEVEL_50 = 50 * LEVEL_INCREMENTOR;

    let taskXP = (taskDifficulty + 10) ** 2 + (taskDifficulty - 2) * 50;

    if (totalXP < LEVEL_20) {
      taskXP += 45;
    }

    if (totalXP < LEVEL_50) {
      taskXP += 45;
    }

    return Number(taskXP);
  } catch (err) {
    console.log(err);
    throw new Error('Unable to calculate the XP');
  }
};

export default calculateTaskXP;
