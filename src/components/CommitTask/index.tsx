/* eslint-disable no-nested-ternary */
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'components/Modal';
import { RootState } from 'reducers';
import Spinner from 'components/Project/Modal/Spinner';
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { ReactComponent as CloseIcon } from 'assets/illustrations/icons/close-outlined.svg';
import config from 'config';
import DepositFundsToWallet from 'components/Project/Modal/DepositFundsToWallet';
import useCommitToTask from './hooks';
import styles from './index.module.scss';

interface ICommitTask {
  handleClose: any;
}

const CommitTask: FC<ICommitTask> = ({ handleClose }) => {
  const { commitToTask, getFNDRBalance, pending, hash, fndrBalance } =
    useCommitToTask();
  const { selectedTask } = useSelector((state: RootState) => state.flProject);
  useEffect(() => {
    getFNDRBalance();
  }, []);

  return (
    <Modal onClose={handleClose} padding="33px 50px">
      {fndrBalance >= import.meta.env.FNDR_TOKEN_AMOUNT ? (
        <div className={styles['commit-task-container']}>
          <h1>Commit to task</h1>
          {pending === 'initial' ? (
            <>
              <div>
                <div>
                  <span>Compensation</span>
                  <span>{selectedTask?.price} USDC</span>
                </div>
                <div>
                  <span>FNDR Coin Required</span>
                  <span>{selectedTask?.fndrToken} FNDR</span>
                </div>
              </div>
              <p>
                <span>
                  *Your compensation will be unlocked after task completion
                </span>
                {/* <span>Top Up Wallet +</span> */}
              </p>
              <button
                onClick={() =>
                  commitToTask(
                    selectedTask?.taskSmartContractId,
                    Number(selectedTask?.fndrToken)
                  )
                }
              >
                Commit to task
              </button>
            </>
          ) : pending === 'approving' ? (
            <div className={styles['accept-task-content']}>
              <Spinner />
              <p>Waiting for approving</p>
              <p>Confirm this transaction in your wallet</p>
              {hash === '' ? (
                <p>
                  <i className="material-icons">open_in_new</i>&nbsp;View on
                  Explorer
                </p>
              ) : (
                <p>
                  <a
                    href={`${config.explorerURL}/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="material-icons">open_in_new</i>&nbsp;View on
                    Explorer
                  </a>
                </p>
              )}
            </div>
          ) : pending === 'confirming' ? (
            <div className={styles['accept-task-content']}>
              <Spinner />
              <p>Waiting for confimation</p>
              <p>Confirm this transaction in your wallet</p>
              {hash === '' ? (
                <p>
                  <i className="material-icons">open_in_new</i>&nbsp;View on
                  Explorer
                </p>
              ) : (
                <p>
                  <a
                    href={`${config.explorerURL}/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="material-icons">open_in_new</i>&nbsp;View on
                    Explorer
                  </a>
                </p>
              )}
            </div>
          ) : pending === 'confirmed' ? (
            <div className={styles['accept-task-content']}>
              <CheckIcon width={100} height={100} />
              <p>Transaction has been confirmed</p>
              <p>
                As you start working on the task, update the status to "In
                progress"
              </p>
              {hash === '' ? (
                <p>
                  <i className="material-icons">open_in_new</i>&nbsp;View on
                  Explorer
                </p>
              ) : (
                <p>
                  <a
                    href={`${config.explorerURL}/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="material-icons">open_in_new</i>&nbsp;View on
                    Explorer
                  </a>
                </p>
              )}
            </div>
          ) : (
            <div className={styles['accept-task-content']}>
              <CloseIcon width={120} height={120} />
              <p>This Transaction has been failed</p>
              <p>Confirm this transaction in your wallet</p>
              {hash === '' ? (
                <p>
                  <i className="material-icons">open_in_new</i>&nbsp;View on
                  Explorer
                </p>
              ) : (
                <p>
                  <a
                    href={`${config.explorerURL}/tx/${hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="material-icons">open_in_new</i>&nbsp;View on
                    Explorer
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <DepositFundsToWallet />
      )}
    </Modal>
  );
};

export default CommitTask;
