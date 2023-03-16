import { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Modal from 'components/Modal';
import { toggleWalletDrawer } from 'actions/app';
import { useProvider } from '@arcana/auth-react';
import { EthereumProvider } from '@arcana/auth';
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
  const { provider: arcanaProvider } = useProvider();
  const { publishProject, setDeploying, deploying } = useProject();

  const { selectedProjectAddress, deploy_state } = useSelector(
    (state: RootState) => state.flProject
  );
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const dispatch = useDispatch();
  const toggle = useSelector((state: RootState) => state.app.toggle);

  useEffect(() => {
    setDeploying(deploy_state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    dispatch(toggleWalletDrawer(!toggle));
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
            publishProject={() => publishProject(projectId)}
            usdcBalance={usdcBalance}
            arcanaProvider={arcanaProvider}
          />
        );
      case 'deploying':
        return <DeployingState />;
      case 'deploy_success':
        return (
          <DeploySuccessState
            selectedProjectAddress={selectedProjectAddress}
            onClose={handleClose}
            walletToggle={handleToggle}
          />
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
  arcanaProvider: EthereumProvider;
}

const GoLiveState: FC<IGoLiveState> = ({
  budget,
  projectId,
  usdcBalance,
  publishProject,
  arcanaProvider,
}) => {
  return (
    <>
      <div className={styles['publish-content']}>
        <div>
          <span>Project Budget</span>
          <span>${budget} USDC</span>
        </div>
        {/* <div>
          <span>Wallet Balance</span>
          <span>${usdcBalance} USDC</span>
        </div> */}
        <div>
          <span>
            Publishing your project means putting it on the blockchain. This
            will allow buidlers from all over the world to apply to your tasks!
          </span>
        </div>
      </div>
      <div className={styles['small-text']}>
        <span>
          Clicking publish project initiates Smart Contract creation. You will
          need $MATIC tokens in the next step.
        </span>
      </div>
      <div style={{ margin: '40px 141px' }}>
        <button
          className={styles['publish-go-live']}
          onClick={() => publishProject(projectId)}
        >
          Publish Project
        </button>
      </div>
    </>
  );
};

const DeployingState = () => {
  return (
    <div className={styles['publish-deploying-content']}>
      <Spinner />
      <p>Smart Contract is being created!</p>
      <p>Confirm gas fee estimate in your wallet </p>
    </div>
  );
};

interface IDeploySuccessState {
  selectedProjectAddress: string;
  onClose: () => void;
  walletToggle: () => void;
}

const DeploySuccessState: FC<IDeploySuccessState> = ({
  selectedProjectAddress,
  onClose,
  walletToggle,
}) => {
  return (
    <>
      <div className={styles['publish-deploying-content']}>
        <CheckIcon width={100} height={100} />
        <p>Your project is now live!</p>
        <p>
          Your project&apos;s smart contract id:{' '}
          {selectedProjectAddress.slice(0, 10)}
          ...
          {selectedProjectAddress.slice(
            selectedProjectAddress.length - 8,
            selectedProjectAddress.length
          )}
        </p>
      </div>
      <div className={styles['publish-footer']}>
        <button className={styles['publish-go-live']} onClick={walletToggle}>
          Deposit Funds
        </button>
        <div onClick={onClose}>
          {' '}
          <p style={{ cursor: 'pointer' }}>I&apos;ll do it later</p>
        </div>
      </div>
    </>
  );
};

export default PublishProjectModal;
