import { Dispatch, FC, SetStateAction } from 'react';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import styles from './index.module.scss';
import { AbiItem } from 'web3-utils';
import { profileManageContractAddress } from 'contracts/contracts';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface IHeaderProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  budget: number,
  projectName: string;
  founderName: string;
}

const Header: FC<IHeaderProps> = (props) => {

  const navigator = useNavigate();

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedProjectAddress } = useSelector((state: RootState) => state.flProject);

  const handleOpen = async () => {
    try {
      const web3 = getWeb3Instance();
      const profileManageContract = new web3.eth.Contract(ProfileManageAbi.abi as AbiItem[], profileManageContractAddress);
      const address = await profileManageContract.methods.getProfileContractAddress(walletId).call();

      if (address !== "0x0000000000000000000000000000000000000000") {
        props.setOpen(true);
      } else {
        toast.error('Please mint your profile on chain');
        navigator('/profile');
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div className={styles.container}>
        <span className={styles['project-name']}>{props.projectName}</span>
        <span className={styles['founder-name']}>{props.founderName}</span>
        {
          selectedProjectAddress === '' && (
            <button onClick={handleOpen}>Publish a Project</button>
          )
        }
        {
          selectedProjectAddress !== '' && props.budget !== 0 && <span className={styles['deposit-funds']}>Deposit Funds: {props.budget} USDC</span>
        }
        {
          selectedProjectAddress !== '' && (
            <div className={styles['contract-address']}>Smart Contract Id: {selectedProjectAddress.slice(0, 6)}...{selectedProjectAddress.slice(selectedProjectAddress.length - 5, selectedProjectAddress.length)}</div>
          )
        }
      </div>
    </>
  );
};

export default Header;
