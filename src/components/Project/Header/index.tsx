import { Dispatch, FC, SetStateAction } from 'react';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import { AbiItem } from 'web3-utils';
import { profileManageContractAddress } from 'contracts/contracts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GET_DEPLOY_STATE } from 'actions/flProject/types';
import styles from './index.module.scss';

interface IHeaderProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  budget: number;
  projectName: string;
  founderName: string;
}

const Header: FC<IHeaderProps> = props => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedProjectAddress, isDeposit } = useSelector(
    (state: RootState) => state.flProject
  );

  const handleOpen = async () => {
    try {
      const web3 = getWeb3Instance();
      const profileManageContract = new web3.eth.Contract(
        ProfileManageAbi.abi as AbiItem[],
        profileManageContractAddress
      );
      const profile_address = await profileManageContract.methods
        .getProfileContractAddress(walletId)
        .call();

      if (profile_address !== '0x0000000000000000000000000000000000000000') {
        dispatch({
          type: GET_DEPLOY_STATE,
          payload:
            selectedProjectAddress !== ''
              ? isDeposit
                ? 'deposit_success'
                : 'deposit'
              : 'go_live',
        });
        props.setOpen(true);
      } else {
        toast.error('Please mint your profile on chain');
        navigate('/profile');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedProjectAddress);
    toast.success('Copied!');
  };

  return (
    <>
      <div className={styles.container}>
        <span className={styles['project-name']}>{props.projectName}</span>
        <span className={styles['founder-name']}>{props.founderName}</span>
        {selectedProjectAddress === '' ? (
          <button onClick={handleOpen}>Publish a Project</button>
        ) : !isDeposit ? (
          <button onClick={handleOpen}>Deposit Funds</button>
        ) : (
          <span className={styles['deposit-funds']}>
            Deposit Funds: {Number(props.budget) * 1.1} USDC
          </span>
        )}
        {selectedProjectAddress !== '' && (
          <div className={styles['contract-address']}>
            Smart Contract Id: {selectedProjectAddress.slice(0, 6)}...
            {selectedProjectAddress.slice(
              selectedProjectAddress.length - 5,
              selectedProjectAddress.length
            )}
            <i className="material-icons-200" onClick={handleCopy}>
              content_copy
            </i>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
