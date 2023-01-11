import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileFactoryAbi from 'contracts/abi/ProfileFactory.sol/ProfileFactory.json';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';

function later(delay: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

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
      config.profileFactoryAddress,
      {
        gasPrice: '60000000000',
      }
    );
    await ProfileFactory.methods
      .createProfile(config.USDCAddress, name, title)
      .send({ from: address })
      .on('transactionHash', (hash: any) => {
        setDeploying('deploying');
        console.log(deploying);
      })
      .on('receipt', () => {
        setDeploying('deploy_success');
        console.log(deploying);
      });

    await later(3000);
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default createProfileContract;
