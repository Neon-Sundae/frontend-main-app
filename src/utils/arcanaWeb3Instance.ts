import { AuthContextType } from '@arcana/auth-react/types/typings';
import { getArcanaWeb3Instance, getWeb3Instance } from 'utils/web3EventFn';

const arcanaWeb3InstanceFunc = async (auth: AuthContextType) => {
  let arcanaWeb3Instance = null;
  if (auth.isLoggedIn) arcanaWeb3Instance = await getArcanaWeb3Instance(auth);
  let web3;
  if (arcanaWeb3Instance) {
    web3 = arcanaWeb3Instance;
  } else {
    web3 = getWeb3Instance();
  }
  return web3;
};
export default arcanaWeb3InstanceFunc;
