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
  organisationOwnerWalletId: string;
}

const Header: FC<IHeaderProps> = props => {
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
        // TODO - Move to profile page
        // navigate('/profile');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditButtonClick = () => {
    setShowProjectFormModalWithData(true);
  };

  const isFounder = () => {
    if (walletId === props.organisationOwnerWalletId) return true;
    return false;
  };
  console.log(isFounder());
  return (
    <div className={styles.container}>
      <div className={styles['project-info']}>
        <div className={styles['name-publish-btn-row']}>
          <p className={styles['project-name']}>{props.projectName}</p>
          {props.founderAddress?.toLowerCase() === walletId?.toLowerCase() &&
            selectedProjectAddress === '' && (
              <button onClick={handleOpen} className={styles.transparentBtn}>
                Publish a Project
              </button>
            )}
        </div>
        <div className={styles['org-edit-project-row']}>
          <span className={styles['by-org-name']}>
            <p className={styles['founder-name']}>
              by&nbsp;&nbsp;{props.organisationName}
            </p>
            {selectedProjectAddress && (
              <VerifiedIcon
                className={styles['project-verified']}
                width={20}
                height={20}
              />
            )}
          </span>
          {isFounder() && (
            <button
              onClick={handleEditButtonClick}
              className={styles['edit-project-btn']}
            >
              Edit project &nbsp; <Pencil width={15} height={15} />
            </button>
          )}
        </div>
      </div>

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
