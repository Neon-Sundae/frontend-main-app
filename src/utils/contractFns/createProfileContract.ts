import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileFactoryAbi from 'contracts/abi/ProfileFactory.sol/ProfileFactory.json';
import { profileFactoryAddress, USDCAddress } from 'contracts/contracts';
import { Dispatch, SetStateAction } from 'react';

const createProfileContract = async (
  address: string | undefined,
  name: string | undefined,
  title: string | undefined,
  deploying: string,
  setDeploying: Dispatch<SetStateAction<string>>
) => {
  try {
    if (!address || !name || !title)
      throw new Error('Unable to create profile');

    const web3 = getWeb3Instance();

    const ProfileFactory = new web3.eth.Contract(
      ProfileFactoryAbi.abi as AbiItem[],
      profileFactoryAddress
    );
    await ProfileFactory.methods
      .createProfile(USDCAddress, name, title)
      .send({ from: address })
      .on('transactionHash', (hash: any) => {
        setDeploying('deploying');
        console.log(deploying);
      })
      .on('receipt', () => {
        setDeploying('deploy_success');
        console.log(deploying);
      });
  } catch (error) {
    console.log(error);
    throw new Error('Unable to create profile');
  }
};

export default createProfileContract;
