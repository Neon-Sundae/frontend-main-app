/* eslint-disable camelcase */
import { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Modal from 'components/Modal';
import DepositFundsToWallet from './DepositFundsToWallet';
import { useProject } from '../Landing/hooks';
import styles from './index.module.scss';
import Spinner from './Spinner';

interface IPublishProject {
  setOpen: Dispatch<SetStateAction<boolean>>;
  usdcBalance: number;
  projectId: string;
  budget: number;
}

const PublishProjectModal: FC<IPublishProject> = ({
  setOpen,
  usdcBalance,
  projectId,
  budget,
}) => {
  const { publishProject, setDeploying, deploying } = useProject();

  const { selectedProjectAddress, deploy_state } = useSelector(
    (state: RootState) => state.flProject
  );
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    setDeploying(deploy_state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  if (showTopUpModal) {
    return (
      <Modal onClose={handleClose} width="550px" height="500px">
        <DepositFundsToWallet />;
      </Modal>
    );
  }

  const renderByDeployingState = () => {
    switch (deploying) {
      case 'go_live':
        return (
          <GoLiveState
            budget={budget}
            projectId={projectId}
            publishProject={publishProject}
            usdcBalance={usdcBalance}
          />
        );
      case 'deploying':
        return <DeployingState />;
      case 'deploy_success':
        return (
          <DeploySuccessState selectedProjectAddress={selectedProjectAddress} />
        );
      default:
        return null;
    }
  };

  return (
    <Modal onClose={handleClose} width="550px" height="500px">
      {usdcBalance >= Number(Number(budget * 1.1).toFixed(2)) ? (
        <>
          <h1 className={styles['publish-title']}>Publish your project</h1>
          <div className={styles['publish-content-wrapper']}>
            {renderByDeployingState()}
          </div>
        </>
      ) : (
        <DepositFundsToWallet />
      )}
    </Modal>
  );
};

interface IGoLiveState {
  budget: number;
  projectId: string;
  usdcBalance: number;
  publishProject: (projectId: string) => Promise<void>;
}

const GoLiveState: FC<IGoLiveState> = ({
  budget,
  projectId,
  usdcBalance,
  publishProject,
}) => {
  return (
    <>
      <div className={styles['publish-content']}>
        <div>
          <span>Your Wallet Amount (USDC)</span>
          <span>${usdcBalance.toLocaleString()} USDC</span>
        </div>
        <div>
          <span>Project Budget</span>
          <span>${budget.toFixed(2).toLocaleString()}</span>
        </div>
        <div>
          <span>Total To Deposit</span>
          <span>${budget} USDC</span>
        </div>
      </div>
      <button
        className={styles['publish-go-live']}
        onClick={() => publishProject(projectId)}
      >
        Publish Project
      </button>
    </>
  );
};

const DeployingState = () => {
  return (
    <div className={styles['publish-deploying-content']}>
      <Spinner />
      <p>Deploying Contract</p>
      <p>Check your wallet for any confirmations</p>
    </div>
  );
};

interface IDeploySuccessState {
  selectedProjectAddress: string;
}

const DeploySuccessState: FC<IDeploySuccessState> = ({
  selectedProjectAddress,
}) => {
  return (
    <div className={styles['publish-deploying-content']}>
      <CheckIcon width={100} height={100} />
      <p>Your project has been deployed! 🚀</p>
      <p>
        Your project&apos;s contract id: {selectedProjectAddress.slice(0, 10)}
        ...
        {selectedProjectAddress.slice(
          selectedProjectAddress.length - 8,
          selectedProjectAddress.length
        )}
      </p>
    </div>
  );
};

export default PublishProjectModal;
