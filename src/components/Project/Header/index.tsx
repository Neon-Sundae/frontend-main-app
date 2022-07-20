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
import { useState } from 'react';

interface IHeaderProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  budget: number;
  projectName: string;
  founderName: string;
  editable: () => void;
  edit: boolean;
  input: (e: any) => void;
  save: () => void;
}

const Header: FC<IHeaderProps> = ({
  setOpen,
  budget,
  projectName,
  founderName,
  editable,
  edit,
  input,
  save,
}) => {
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
      const profileAddress = await profileManageContract.methods
        .getProfileContractAddress(walletId)
        .call();

      if (profileAddress !== '0x0000000000000000000000000000000000000000') {
        dispatch({
          type: GET_DEPLOY_STATE,
          payload: (() => {
            if (selectedProjectAddress !== '' && isDeposit && 'deposit_success')
              return 'deposit';
            return 'go_live';
          })(),
        });
        setOpen(true);
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
    <div className={styles.container}>
      {
        edit ? <> <input defaultValue={projectName} name="name" onChange={(e) => input(e)} placeholder='Project Name' />  <span className={styles['founder-name']}>{founderName}</span></> : (<><span className={styles['project-name']}>{projectName}</span>
          <span className={styles['founder-name']}>{founderName}</span></>)
      }
      {(() => {
        if (selectedProjectAddress === '')
          return (
            <>
              <button onClick={handleOpen}>Publish a Project</button>
              <button onClick={() => editable()} className={styles.editBtn} >{edit ? <a onClick={() => save()}>💾</a> : '📝'}</button>
              <button onClick={() => editable()} className={styles.editBtn} style={{
                color: 'transparent',
                textShadow: '0 0 0 white',
              }} >{edit ? '❌' : ''}</button>
            </>
          );
        if (!isDeposit)
          return <button onClick={handleOpen}>Deposit Funds</button>;
        return (
          <span className={styles['deposit-funds']}>
            Deposit Funds: {Number(budget) * 1.1} USDC
          </span>
        );
      })()}
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
  );
};

export default Header;
