import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'components/Modal';
import Spinner from 'components/Project/Modal/Spinner';
import { RootState } from 'reducers';
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { ReactComponent as CloseIcon } from 'assets/illustrations/icons/close-outlined.svg';
import DepositFundsToWallet from 'components/Project/Modal/DepositFundsToWallet';
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

  const { selectedProjectAddress, selectedTask, taskXP } = useSelector(
    (state: RootState) => state.flProject
  );

  useEffect(() => {
    if (pending === 'confirmed') {
      setTimeout(() => {
        handleSuccess();
      }, 2000);
    }
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
        selectedTask?.estimatedDifficulty
      );
    } else {
      setPending('budget_exceed');
    }
  };
  console.log('selectedBuilder', selectedBuilder);
  return (
    <Modal onClose={handleClose} width="550px" height="500px">
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
          <div className={styles['selected-builder-details']}>
            <img
              src={selectedBuilder.Profile.picture}
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
          {pending === 'initial' ? (
            <>
              <div>
                <div>
                  <span>Project Amount</span>
                  <span>
                    {Number(Number(project_budget * 1.1).toFixed(4))} USDC
                  </span>
                </div>
                <div>
                  <span>Amount Required</span>
                  <span>{selectedTask?.price} USDC</span>
                </div>
              </div>
              <p>
                {Number(Number(project_budget * 1.1).toFixed(4)) >=
                selectedTask?.price ? (
                  <span>*Amount required to compensate builder</span>
                ) : (
                  <span>*Your wallet amount is to low</span>
                )}
                <span>Top Up Wallet +</span>
              </p>
              <button onClick={handleSelect}>Confirm</button>
            </>
          ) : pending === 'waiting' ? (
            <div className={styles['accept-task-content']}>
              <Spinner />
              <p>Waiting for confimation</p>
              <p>Confirm this transaction in your wallet</p>
            </div>
          ) : pending === 'confirmed' ? (
            <div className={styles['accept-task-content']}>
              <CheckIcon width={100} height={100} />
              <p>Builder selected succesfully!</p>
              <p>We’ve sent Builder an update on email & Discord </p>
            </div>
          ) : pending === 'budget_exceed' ? (
            <div className={styles['accept-task-content']}>
              <CloseIcon width={120} height={120} />
              <p>This Transaction has been failed due to low balance</p>
              <p>Task cannot be deployed as it exceeds project budget </p>
              <button onClick={() => setPending('add_funds')}>Add Funds</button>
            </div>
          ) : (
            <div className={styles['accept-task-content']}>
              <CloseIcon width={120} height={120} />
              <p>This Transaction has been failed</p>
              <p>Confirm this transaction in your wallet </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SelectBuilder;
