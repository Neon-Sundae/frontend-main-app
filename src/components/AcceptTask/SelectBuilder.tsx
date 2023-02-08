/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'components/Modal';
import Spinner from 'components/Project/Modal/Spinner';
import { RootState } from 'reducers';
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { ReactComponent as CloseIcon } from 'assets/illustrations/icons/close-outlined.svg';
import { ReactComponent as LockIcon } from 'assets/illustrations/icons/lock.svg';
import DepositFundsToWallet from 'components/Project/Modal/DepositFundsToWallet';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import styles from './index.module.scss';
import { useSelectBuilder } from './hooks';

interface ISelectBuilder {
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleSuccess: any;
  project_budget: number;
  selectedBuilder: any;
}

const SelectBuilder: FC<ISelectBuilder> = ({
  setOpen,
  handleSuccess,
  project_budget,
  selectedBuilder,
}) => {
  const { selectBuilder, pending, setPending } = useSelectBuilder();

  const { selectedProjectAddress, selectedTask, taskXP, projectTaskAddress } =
    useSelector((state: RootState) => state.flProject);

  useEffect(() => {
    if (pending === 'confirmed') {
      setTimeout(() => {
        handleSuccess();
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  const handleClose = () => setOpen(false);

  const handleSelect = () => {
    if (project_budget >= selectedTask?.price) {
      selectBuilder(
        selectedProjectAddress,
        selectedBuilder,
        selectedTask?.taskId,
        selectedTask?.name,
        selectedTask?.price,
        taskXP,
        projectTaskAddress
      );
    } else {
      setPending('budget_exceed');
    }
  };
  return (
    <Modal
      onClose={handleClose}
      width="550px"
      height="500px"
      padding="33px 55px"
    >
      {pending === 'add_funds' ? (
        <DepositFundsToWallet />
      ) : (
        <div className={styles['select-builder-container']}>
          <h1
            style={{
              textAlign:
                pending === 'confirmed' || pending === 'failed'
                  ? 'center'
                  : 'left',
            }}
          >
            {pending === 'confirmed'
              ? 'Complete'
              : pending === 'failed'
              ? 'Failed'
              : 'Select Builder'}
          </h1>

          {pending === 'initial' ? (
            <>
              <div className={styles['selected-builder-details']}>
                <img
                  src={
                    selectedBuilder.Profile.picture ||
                    getDefaultAvatarSrc(
                      selectedBuilder?.Profile?.user?.name
                        ?.charAt(0)
                        .toUpperCase()
                    )
                  }
                  alt=""
                  width="70.51px"
                  height="70.51px"
                />
                <p>
                  <a href="#">{selectedBuilder.Profile.user.name} </a>
                  <br />
                  {selectedBuilder.Profile.title}
                </p>
              </div>
              <div style={{ marginTop: '3%' }}>
                <div>
                  <span>Builder Compensation</span>
                  <span>{selectedTask?.price} USDC</span>
                </div>
                <div>
                  <span>Platform Fee</span>
                  <span>5%</span>
                </div>
                <div className={styles['line']}></div>
                <div>
                  <span>Total Amount</span>
                  <span>
                    {selectedTask?.price + selectedTask?.price * 0.05} USDC
                  </span>
                </div>
              </div>
              <p className={styles['small-text']}>
                This creates Non-Transferable NFTs. Amount Locked is not
                withdrawable unless the builder agrees to cancel task. You will
                need MATIC tokens.
              </p>
              <button
                onClick={handleSelect}
                style={{
                  width: 'inherit',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                <LockIcon
                  style={{ marginTop: '-22px', marginLeft: '-38px' }}
                  width={90}
                  height={90}
                ></LockIcon>
                <p>${selectedTask?.price + selectedTask?.price * 0.05} USDC </p>
              </button>
            </>
          ) : pending === 'waiting' ? (
            <div className={styles['accept-task-content']}>
              <Spinner />

              <p>NFT is being created</p>
              <p>Confirm gas fee estimate in your wallet</p>
            </div>
          ) : pending === 'confirmed' ? (
            <div className={styles['accept-task-content']}>
              <CheckIcon width={100} height={100} />

              <p>The NFT has been minted!</p>
              <p>
                Builder has been notified! Please wait for the builder to
                commit.
              </p>
            </div>
          ) : pending === 'budget_exceed' ? (
            <div className={styles['accept-task-content']}>
              <CloseIcon width={120} height={120} />
              <p>This Transaction has failed due to low balance</p>
              <p>Task cannot be deployed as it exceeds project budget </p>
              <button onClick={() => setPending('add_funds')}>Add Funds</button>
            </div>
          ) : (
            <div className={styles['accept-task-content']}>
              <CloseIcon width={120} height={120} />
              <p>This Transaction has failed</p>
              <p>Please try again or check your wallet for more information </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SelectBuilder;
