/* eslint-disable camelcase */
import { FC, Dispatch, SetStateAction, useEffect } from 'react';
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { ReactComponent as SugarIcon } from 'assets/illustrations/icons/sugar.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Modal from 'components/Modal';
import DepositFundsToWallet from './DepositFundsToWallet';
import { useProject } from '../Landing/hooks';
import styles from './index.module.scss';
import Spinner from './Spinner';
import clsx from 'clsx';

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

  return (
    <Modal onClose={handleClose}>
      {usdcBalance >= Number(Number(budget * 1.1).toFixed(2)) ? (
        <>
          <h1 className={styles['publish-title']}>
            {deploying === 'go_live'
              ? `Step one, let's publish your project`
              : deploying === 'deposit'
              ? `Step two, please deposit  $${Number(Number(budget * 1.1))
                  .toFixed(2)
                  .toLocaleString('en-US')} USDC`
              : ''}
          </h1>
          <div className={styles['publish-content-wrapper']}>
            {deploying === 'go_live' ? (
              <>
                <div className={styles['publish-content']}>
                  <div>
                    <span>Your Wallet Amount (USDC)</span>
                    <span>${usdcBalance.toLocaleString('en-US')} USDC</span>
                  </div>
                  <div>
                    <span>Project Budget</span>
                    <span>${budget.toFixed(2).toLocaleString('en-US')}</span>
                  </div>
                  <div>
                    <span>Platform Fee</span>
                    <span>
                      10% ($
                      {Number(budget * 0.1)
                        .toFixed(2)
                        .toLocaleString('en-US')}
                      )
                    </span>
                  </div>
                  <div>
                    <span>Total To Deposit</span>
                    <span>
                      ${Number(Number(budget * 1.1).toFixed(2)).toFixed(2)}
                      {''} USDC
                    </span>
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
                      * The following steps will need you to pay gas fees
                    </span>
                  )}
                  <span>Top Up Wallet +</span>
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
                  Publish Project
                </button>
              </>
            ) : deploying === 'deploying' ? (
              <div className={styles['publish-deploying-content']}>
                <Spinner />
                <p>Deploying Contract</p>
                <p>Check your wallet for any confirmations</p>
              </div>
            ) : deploying === 'deploy_success' ? (
              <div className={styles['publish-deploying-content']}>
                <CheckIcon width={100} height={100} />
                <p>Your project has been deployed! 🚀</p>
                <p>
                  Your project's contract id:{' '}
                  {selectedProjectAddress.slice(0, 10)}...
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
                    <span>Your Wallet Amount (USDC)</span>
                    <span>${usdcBalance.toLocaleString('en-US')} USDC</span>
                  </div>

                  <div>
                    <span>Project Budget</span>
                    <span>${budget.toLocaleString('en-US')}</span>
                  </div>

                  <div>
                    <span>Platform Fee</span>
                    <span>10% (${Number(budget * 0.1).toFixed(2)})</span>
                  </div>
                  <div>
                    <span>Total Deposit</span>
                    <span>
                      ${Number(Number(budget * 1.1).toFixed(2)).toFixed(2)}
                      {''} USDC
                    </span>
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
                      * You can always withdraw this money later
                    </span>
                  )}
                  <span>Top Up Wallet +</span>
                </div>
                <button
                  className={styles['publish-go-live']}
                  onClick={() => depositFunds(budget)}
                >
                  Let's Deposit!
                </button>
              </>
            ) : deploying === 'approving' ? (
              <div className={styles['publish-deploying-content']}>
                <Spinner />
                <p>Next, you will need to approve the transfer</p>
                <p>
                  This usually takes sometime. Sometimes blockchains can be so
                  slow 🐢
                </p>
              </div>
            ) : deploying === 'depositing' ? (
              <div className={styles['publish-deploying-content']}>
                <Spinner />
                <p>Waiting to receive your funds</p>
                <p>This usually takes a couple of seconds...🐢</p>
              </div>
            ) : deploying === 'deposit_success' ? (
              <div className={styles['publish-deploying-content']}>
                <SugarIcon width={100} height={100} />
                <p>Woohoo! You have successfully funded your project.</p>
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
