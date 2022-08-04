/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { getWeb3Instance } from 'utils/web3EventFn';
import ProfileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import { AbiItem } from 'web3-utils';
import { profileManageContractAddress } from 'contracts/contracts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GET_DEPLOY_STATE } from 'actions/flProject/types';
import { ReactComponent as VerifiedIcon } from 'assets/illustrations/icons/verified.svg';
import { ReactComponent as Pencil } from 'assets/illustrations/icons/pencil.svg';
import styles from './index.module.scss';
import CreatePrjModalWithData from '../../StartPrjModal/CreatePrjModalWithData';

interface IHeaderProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  budget: number;
  projectName: string;
  founderAddress: string;
  organisationName: string;
}

const Header: FC<IHeaderProps> = props => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedProjectAddress, isDeposit } = useSelector(
    (state: RootState) => state.flProject
  );
  const [showProjectFormModalWithData, setShowProjectFormModalWithData] =
    useState(false);

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

  const handleEditButtonClick = () => {
    setShowProjectFormModalWithData(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles['project-info']}>
        <span className={styles['project-name']}>{props.projectName}</span>
        <span className={styles['founder-name']}>
          by&nbsp;&nbsp;{props.organisationName}
        </span>
        {props.founderAddress?.toLowerCase() === walletId?.toLowerCase() ? (
          selectedProjectAddress === '' ? (
            <button onClick={handleOpen} className={styles.transparentBtn}>
              Publish a Project
            </button>
          ) : !isDeposit ? (
            <button onClick={handleOpen} className={styles.transparentBtn}>
              Deposit Funds
            </button>
          ) : (
            <>
              <span className={styles['deposit-funds']}>
                Funds: {Number(Number(Number(props.budget) * 1.1).toFixed(4))}{' '}
                USDC
              </span>
              <VerifiedIcon
                className={styles['project-verified']}
                width={20}
                height={20}
              />
            </>
          )
        ) : selectedProjectAddress === '' ? (
          <button className={styles.transparentBtn}> Not Published</button>
        ) : !isDeposit ? (
          <button className={styles.transparentBtn}>Not Deposited</button>
        ) : (
          <>
            <span className={styles['deposit-funds']}>
              Deposit Funds:{' '}
              {Number(Number(Number(props.budget) * 1.1).toFixed(4))}
            </span>
            <VerifiedIcon
              className={styles['project-verified']}
              width={20}
              height={20}
            />
          </>
        )}
        <button onClick={handleEditButtonClick}>
          Edit project &nbsp; <Pencil />
        </button>

        {/* {
            founder.toLowerCase() === walletId?.toLowerCase() && selectedProjectAddress === '' ? (
              <button onClick={handleOpen}>Publish a Project</button>
            ) : founder.toLowerCase() === walletId?.toLowerCase() && !isDeposit ? (
              <button onClick={handleOpen}>Deposit Funds</button>
            ) : <><span className={styles['deposit-funds']}>Deposit Funds: {Number(Number(Number(props.budget) * 1.1).toFixed(4))} USDC</span><VerifiedIcon className={styles['project-verified']} width={20} height={20} /></>
          } */}
      </div>
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

      {showProjectFormModalWithData && (
        <CreatePrjModalWithData
          onClose={() =>
            setShowProjectFormModalWithData(!showProjectFormModalWithData)
          }
        />
      )}
    </div>
  );
};

export default Header;
