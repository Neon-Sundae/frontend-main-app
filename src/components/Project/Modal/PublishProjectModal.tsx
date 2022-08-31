/* eslint-disable camelcase */
import { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { ReactComponent as SugarIcon } from 'assets/illustrations/icons/sugar.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Modal from 'components/Modal';
import clsx from 'clsx';
import DepositFundsToWallet from './DepositFundsToWallet';
import { useProject } from '../Landing/hooks';
import styles from './index.module.scss';
import Spinner from './Spinner';

interface IPublishProject {
  setOpen: Dispatch<SetStateAction<boolean>>;
  usdcBalance: number;
  projectId: string;
  budget: number;
  projectName: string;
  projectDescription: string;
}

const PublishProjectModal: FC<IPublishProject> = ({
  setOpen,
  usdcBalance,
  projectId,
  budget,
  projectName,
  projectDescription,
}) => {
  const {
    getGasFeeToPublish,
    publishProject,
    depositFunds,
    setDeploying,
    deploying,
    gasFee,
  } = useProject();

  const { selectedProjectAddress, deploy_state } = useSelector(
    (state: RootState) => state.flProject
  );

  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    getGasFeeToPublish();
    setDeploying(deploy_state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleTopUpWallet = () => {
    setShowTopUpModal(true);
  };
  if (showTopUpModal) {
    return (
      <Modal onClose={handleClose} width="550px" height="500px">
        <DepositFundsToWallet />;
      </Modal>
    );
  }
  return (
    <Modal onClose={handleClose} width="550px" height="500px">
      {usdcBalance >= Number(Number(budget * 1.1).toFixed(2)) ? (
        <>
          <h1 className={styles['publish-title']}>Publish your project</h1>
          <div className={styles['publish-content-wrapper']}>
            {deploying === 'go_live' ? (
              <>
                <div className={styles['publish-content']}>
                  <div>
                    <span>Wallet Amount</span>
                    <span>${usdcBalance} USDC</span>
                  </div>
                  <div>
                    <span>Gas Fee</span>
                    <span>10% Platform fee</span>
                  </div>
                  <div>
                    <span>Deposit</span>
                    <span>${Number(Number(budget * 1.1).toFixed(2))} USDC</span>
                  </div>
                </div>
                <div className={styles['publish-info']}>
                  {Number(usdcBalance) <
                  Number(Number(budget * 1.1).toFixed(2)) ? (
                    <span
                      className={clsx(
                        styles['font-size--small--low'],
                        styles['']
                      )}
                    >
                      *Your wallet amount is to low
                    </span>
                  ) : (
                    <span className={styles['font-size--small--enough']}>
                      *You can always withdraw
                    </span>
                  )}
                  <span onClick={() => handleTopUpWallet()}>
                    Top Up Wallet +
                  </span>
                </div>
                <button
                  className={styles['publish-go-live']}
                  onClick={() =>
                    publishProject(
                      projectId,
                      budget,
                      projectName,
                      projectDescription
                    )
                  }
                >
                  Go Live
                </button>
              </>
            ) : deploying === 'deploying' ? (
              <div className={styles['publish-deploying-content']}>
                <Spinner />
                <p>Deploying Contract</p>
                <p>Confirm this transaction in your wallet</p>
              </div>
            ) : deploying === 'deploy_success' ? (
              <div className={styles['publish-deploying-content']}>
                <CheckIcon width={100} height={100} />
                <p>This Transaction has been confirmed on mainnet</p>
                <p>
                  Your contract id: {selectedProjectAddress.slice(0, 10)}...
                  {selectedProjectAddress.slice(
                    selectedProjectAddress.length - 8,
                    selectedProjectAddress.length
                  )}
                </p>
              </div>
            ) : deploying === 'deposit' ? (
              <>
                <div className={styles['publish-content']}>
                  <div>
                    <span>Wallet Amount</span>
                    <span>${usdcBalance} USDC</span>
                  </div>
                  <div>
                    <span>Gas Fee</span>
                    <span>10% Platform fee</span>
                  </div>
                  <div>
                    <span>Deposit</span>
                    <span>${Number(Number(budget * 1.1).toFixed(2))} USDC</span>
                  </div>
                </div>
                <div className={styles['publish-info']}>
                  {Number(usdcBalance) <
                  Number(Number(budget * 1.1).toFixed(2)) ? (
                    <span
                      className={clsx(
                        styles['font-size--small--low'],
                        styles['']
                      )}
                    >
                      *Your wallet amount is to low
                    </span>
                  ) : (
                    <span className={styles['font-size--small--enough']}>
                      *You can always withdraw
                    </span>
                  )}
                  <span
                    className={styles['top-up-text']}
                    onClick={() => handleTopUpWallet()}
                  >
                    Top Up Wallet +
                  </span>
                </div>
                <button
                  className={styles['publish-go-live']}
                  onClick={() => depositFunds(budget)}
                >
                  Deposit
                </button>
              </>
            ) : deploying === 'approving' ? (
              <div className={styles['publish-deploying-content']}>
                <Spinner />
                <p>Waiting for approving</p>
                <p>Confirm this transaction in your wallet</p>
              </div>
            ) : deploying === 'depositing' ? (
              <div className={styles['publish-deploying-content']}>
                <Spinner />
                <p>Waiting for confirmation</p>
                <p>Confirm this transaction in your wallet</p>
              </div>
            ) : deploying === 'deposit_success' ? (
              <div className={styles['publish-deploying-content']}>
                <SugarIcon width={100} height={100} />
                <p>Your project is live!</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <DepositFundsToWallet />
      )}
    </Modal>
  );
};

export default PublishProjectModal;
