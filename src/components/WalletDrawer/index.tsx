import clsx from 'clsx';
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import QRCode from 'react-qr-code';
import { useAuth } from '@arcana/auth-react';
import toast from 'react-hot-toast';
import { gsap, Elastic } from 'gsap';
import bg from 'assets/illustrations/home/wallet-bg.svg';
import withdrawProjectBalance from 'utils/contractFns/withdrawProjectBalance';
import { ReactComponent as USDCVariant1Icon } from 'assets/illustrations/icons/usdc-variant-1.svg';
import getUsdcBalance from 'utils/contractFns/getUsdcBalance';
import depositProjectFunds from 'utils/contractFns/depositProjectFunds';
import withdrawProfileBalance from 'utils/contractFns/withdrawProfileBalance';
import { useFetchUserWalletProjects } from 'queries/organisation';
import { useFetchUserDetailsWrapper } from 'queries/user';
import { useFetchProfileDetailsByUserWrapper } from 'queries/profile';
import styles from './index.module.scss';
import { getContractAvailableBalance } from './_utils';
import InteractionDiv from './interaction';

interface IWalletDrawer {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const WalletDrawer: FC<IWalletDrawer> = ({ open, setOpen }) => {
  const auth = useAuth();
  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsByUserWrapper({
    userId: userData?.user.userId,
  });
  const { data: flProjects } = useFetchUserWalletProjects({
    userId: userData?.user.userId,
    open,
    profileSmartContractId: profileData?.profileSmartContractId,
  });

  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [projectBalance, setProjectBalance] = useState(0);
  const [isExpanded, setExpanded] = useState(false);
  const [depositWithdrawState, setDepositWithdrawState] = useState<
    string | null
  >(null);

  useEffect(() => {
    (async () => {
      const balance = await getContractAvailableBalance(selectedContract, auth);
      setProjectBalance(balance);
    })();
  }, [selectedContract, auth]);

  useEffect(() => {
    setDepositWithdrawState(null);
  }, [selectedContract]);

  const handleClick = () => {
    console.log('clicked');
    setOpen(false);
  };

  const selectProject = (flProject: any) => {
    setSelectedContract(flProject);
    setExpanded(false);
  };

  const getFormattedWalletId = (contractId: string) => {
    if (contractId) {
      return `${contractId?.slice(0, 6)}...${contractId?.slice(
        contractId.length - 6,
        contractId.length
      )}`;
    }

    return '';
  };

  const handleCopyAddress = (contractId: string) => {
    navigator.clipboard.writeText(contractId);
    toast.success('Copied!');
  };

  const toggleWithdrawState = () => {
    if (selectedContract) {
      setDepositWithdrawState('withdraw');
    } else {
      toast.error('Please select a project');
    }
  };

  const toggleDepositState = () => {
    if (selectedContract?.type === 'profile_contract') {
      toast.error('Cannot deposit to profile');
      return;
    }

    if (selectedContract) {
      setDepositWithdrawState('deposit');
    } else {
      toast.error('Please select a project');
    }
  };

  const closeDepositWithdrawState = () => {
    setDepositWithdrawState(null);
  };

  const renderStates = () => {
    switch (depositWithdrawState) {
      case 'deposit':
        return (
          <DepositFlow
            closeDepositWithdrawState={closeDepositWithdrawState}
            getFormattedWalletId={getFormattedWalletId}
            handleCopyAddress={handleCopyAddress}
            selectedContract={selectedContract}
            userAddress={userData?.user.walletId}
            projectBalance={projectBalance}
          />
        );
      case 'withdraw':
        return (
          <ActionContainer>
            <DepositStep2
              isWithdraw
              isProfile={selectedContract.type === 'profile_contract'}
              userAddress={userData?.user.walletId}
              selectedContract={selectedContract}
              projectBalance={projectBalance}
              setDepositWithdrawState={setDepositWithdrawState}
            />
          </ActionContainer>
        );
      default:
        return (
          <div className={styles['wallet-drawer-btn-row']}>
            <button
              className={styles['wallet-drawer-deposit-btn']}
              onClick={toggleDepositState}
            >
              Deposit
            </button>
            <button
              className={styles['wallet-drawer-withdraw-btn']}
              onClick={toggleWithdrawState}
            >
              Withdraw
            </button>
          </div>
        );
    }
  };

  return (
    <div
      className={clsx(
        styles['wallet-side-drawer'],
        open && styles['wallet-side-drawer--open']
      )}
      style={{ backgroundImage: `url(${bg})`, color: 'white' }}
    >
      <div
        className={styles['wallet-drawer-icon-container']}
        onClick={handleClick}
      >
        <i className="material-icons">chevron_right</i>
      </div>

      {!isExpanded ? (
        <div
          onClick={() => setExpanded(true)}
          className={styles['non-expanded-list']}
        >
          {selectedContract ? (
            <div>
              <h4>{selectedContract.name}</h4>
              <p>{getFormattedWalletId(selectedContract.smartContractId)}</p>
            </div>
          ) : (
            <div className={styles['project-list-select']}>
              <h4>Select Project</h4>
            </div>
          )}
          <i className="material-icons">expand_more</i>
        </div>
      ) : (
        <div className={styles['expanded-list']}>
          <div onClick={() => setExpanded(false)}>
            {selectedContract ? (
              <div>
                <h4>{selectedContract.name}</h4>
                <p>{getFormattedWalletId(selectedContract.smartContractId)}</p>
              </div>
            ) : (
              <div className={styles['project-list-select']}>
                <h4>Select Project</h4>
              </div>
            )}
            <i className="material-icons">expand_more</i>
          </div>
          {flProjects ? (
            flProjects.map(flProject => (
              <span key={flProject.id} onClick={() => selectProject(flProject)}>
                {flProject.name}
              </span>
            ))
          ) : (
            <p>No projects</p>
          )}
        </div>
      )}

      <div className={styles['wallet-drawer-balance-row']}>
        <h2>Available balance</h2>
        <span>{projectBalance} USDC</span>
      </div>

      {renderStates()}
    </div>
  );
};

interface IActionContainer {
  children: ReactNode;
}

const ActionContainer: FC<IActionContainer> = ({ children }) => {
  return (
    <div className={styles['wallet-drawer-action-container']}>{children}</div>
  );
};

interface IDepositFlow {
  closeDepositWithdrawState: () => void;
  selectedContract: any;
  handleCopyAddress: (contractId: string) => void;
  getFormattedWalletId: (contractId: string) => ReactNode;
  userAddress: string | undefined;
  projectBalance: number;
}

const DepositFlow: FC<IDepositFlow> = ({
  closeDepositWithdrawState,
  selectedContract,
  handleCopyAddress,
  getFormattedWalletId,
  userAddress,
  projectBalance,
}) => {
  const [currentState, setCurrentState] = useState(1);

  const renderStepState = (): ReactNode => {
    switch (currentState) {
      case 1:
        return (
          <DepositStep1
            closeDepositWithdrawState={closeDepositWithdrawState}
            getFormattedWalletId={getFormattedWalletId}
            handleCopyAddress={handleCopyAddress}
            selectedContract={selectedContract}
            setCurrentState={setCurrentState}
          />
        );
      case 2:
        return (
          <DepositStep2
            setCurrentState={setCurrentState}
            userAddress={userAddress}
            selectedContract={selectedContract}
            projectBalance={projectBalance}
          />
        );
      default:
        return (
          <DepositStep1
            closeDepositWithdrawState={closeDepositWithdrawState}
            getFormattedWalletId={getFormattedWalletId}
            handleCopyAddress={handleCopyAddress}
            selectedContract={selectedContract}
            setCurrentState={setCurrentState}
          />
        );
    }
  };

  return <ActionContainer>{renderStepState()}</ActionContainer>;
};

interface IDepositStep1 {
  closeDepositWithdrawState: () => void;
  selectedContract: any;
  handleCopyAddress: (contractId: string) => void;
  getFormattedWalletId: (contractId: string) => ReactNode;
  setCurrentState: Dispatch<SetStateAction<number>>;
}

const DepositStep1: FC<IDepositStep1> = ({
  closeDepositWithdrawState,
  selectedContract,
  handleCopyAddress,
  getFormattedWalletId,
  setCurrentState,
}) => {
  return (
    <>
      <div className={styles['action-header']}>
        <h4>Deposit with QR</h4>
        <i className="material-icons" onClick={closeDepositWithdrawState}>
          close
        </i>
      </div>
      {selectedContract.smartContractId ? (
        <div className={styles['qr-code-container']}>
          <QRCode
            value={selectedContract.smartContractId}
            bgColor="transparent"
            fgColor="white"
            size={144}
          />
          <div
            className={styles['address-copy-container']}
            onClick={() => handleCopyAddress(selectedContract.smartContractId)}
          >
            <span>
              {getFormattedWalletId(selectedContract.smartContractId)}
            </span>
            <i className="material-icons-200">content_copy</i>
          </div>
          <p className={styles['or-use-text']}>or use</p>
          <button
            className={styles['use-metamask-btn']}
            onClick={() => setCurrentState(2)}
          >
            Connected Wallet
          </button>
        </div>
      ) : (
        <div className={styles['project-unpublished-state']}>
          <p>Project is not published yet</p>
        </div>
      )}
    </>
  );
};

interface IDepositStep2 {
  setCurrentState?: Dispatch<SetStateAction<number>>;
  isWithdraw?: boolean;
  userAddress: string | undefined;
  selectedContract: any;
  projectBalance: number;
  isProfile?: boolean;
  setDepositWithdrawState?: Dispatch<SetStateAction<string | null>>;
}

const DepositStep2: FC<IDepositStep2> = ({
  isWithdraw,
  userAddress,
  setCurrentState,
  selectedContract,
  projectBalance,
  isProfile,
  setDepositWithdrawState,
}) => {
  const auth = useAuth();
  const CIRCLE_WIDTH = 14;
  const SWITCH_WIDTH = 40;
  const [amount, setAmount] = useState('0');
  const [walletBalance, setWalletBalance] = useState(
    isWithdraw ? projectBalance : 0
  );
  const [switchState, setSwitchState] = useState('off');
  const [deployState, setDeploying] = useState('empty');

  const switchRef = useRef(null);
  const circleRef = useRef(null);

  const t1 = gsap.timeline();

  useEffect(() => {
    if (switchState === 'on') {
      t1.to(circleRef.current, {
        duration: 0.5,
        x: SWITCH_WIDTH - CIRCLE_WIDTH - 8,
        ease: Elastic.easeOut.config(1, 0.6),
      });
    } else {
      t1.to(circleRef.current, {
        duration: 0.5,
        x: 0,
        ease: Elastic.easeOut.config(1, 0.6),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchState]);

  useEffect(() => {
    (async () => {
      if (userAddress && !isWithdraw) {
        const balance = await getUsdcBalance(userAddress, auth);
        setWalletBalance(balance);
      }
    })();
  }, [userAddress, isWithdraw, auth]);

  useEffect(() => {
    if (switchState === 'on') {
      setAmount(walletBalance.toString());
    } else {
      setAmount('0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchState]);

  const handleClick = () => {
    if (switchState === 'on') setSwitchState('off');
    else setSwitchState('on');
  };

  const handleSubmit = async () => {
    if (isProfile && selectedContract && userAddress) {
      setDeploying('start');
      await withdrawProfileBalance(
        Number(amount),
        selectedContract.smartContractId,
        userAddress,
        setDeploying,
        auth
      );
    } else if (selectedContract && userAddress && !isWithdraw && !isProfile) {
      setDeploying('start');
      await depositProjectFunds(
        Number(amount),
        selectedContract.smartContractId,
        userAddress,
        setDeploying,
        auth
      );
    } else if (selectedContract && userAddress && isWithdraw && !isProfile) {
      setDeploying('start');
      await withdrawProjectBalance(
        Number(amount),
        selectedContract.smartContractId,
        userAddress,
        setDeploying,
        auth
      );
    }
  };

  const renderByDeployingState = () => {
    switch (deployState) {
      case 'start':
        return (
          <InteractionDiv
            message={
              isWithdraw
                ? 'Beginning Withdrawal'
                : 'Please give permission to access your USDC'
            }
            title={isWithdraw ? 'Withdraw USDC' : 'Deposit USDC'}
            projectName={selectedContract.name}
            successState="no"
            bigMessage={
              isWithdraw
                ? 'Your funds are being withdrawn from'
                : 'Your funds are being deposited in'
            }
          />
        );
      case 'give_usdc_permission':
        return (
          <InteractionDiv
            message="Transacting"
            title={isWithdraw ? 'Withdraw USDC' : 'Deposit USDC'}
            projectName={selectedContract.name}
            successState="no"
            bigMessage={
              isWithdraw
                ? 'Your funds are being withdrawn from'
                : 'Your funds are being deposited in'
            }
          />
        );
      case 'usdc_success':
        return (
          <InteractionDiv
            message="Got it. Thanks! "
            title={isWithdraw ? 'Withdraw USDC' : 'Deposit USDC'}
            projectName={selectedContract.name}
            successState="no"
            bigMessage={
              isWithdraw
                ? 'Your funds are being withdrawn from'
                : 'Your funds are being deposited in'
            }
          />
        );
      case 'deploying':
        return (
          <InteractionDiv
            message=""
            title={isWithdraw ? 'Withdraw USDC' : 'Deposit USDC'}
            projectName={selectedContract.name}
            successState="no"
            bigMessage={
              isWithdraw
                ? 'Your funds are being withdrawn from'
                : 'Your funds are being deposited in'
            }
          />
        );
      case 'deploy_success':
        return (
          <InteractionDiv
            message="Please Refresh your browser to reflect changes"
            title={isWithdraw ? 'Withdraw USDC' : 'Deposit USDC'}
            projectName={selectedContract.name}
            successState="success"
            bigMessage={
              isWithdraw
                ? 'Your funds have been withdrawn from'
                : 'Your funds have been deposited in'
            }
          />
        );
      default:
        return (
          <>
            <div className={styles['action-header']}>
              <h4>{isWithdraw ? 'Withdraw USDC' : 'Deposit USDC'}</h4>
              {!isWithdraw && setCurrentState && (
                <i
                  className={clsx('material-icons', styles['back-icon'])}
                  onClick={() => setCurrentState(1)}
                >
                  arrow_back
                </i>
              )}
              {isWithdraw && setDepositWithdrawState && (
                <i
                  className="material-icons"
                  onClick={() => setDepositWithdrawState(null)}
                >
                  close
                </i>
              )}
            </div>
            <div className={styles['deposit-field-container']}>
              <div className={styles['deposit-field-header']}>
                <div>
                  <p className={styles['deposit-field-header-text']}>
                    {isWithdraw
                      ? 'Project Wallet Balance'
                      : 'Connected Wallet Balance'}
                  </p>
                  <p className={styles['deposit-field-header-balance']}>
                    ${walletBalance.toLocaleString('en-US')} USDC
                  </p>
                </div>
                <USDCVariant1Icon width={40} height={40} />
              </div>
              <div className={styles['deposit-field-action']}>
                <hr className={styles['upper-line']} />
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <hr className={styles['bottom-line']} />
              </div>
              <div className={styles['deposit-set-max-row']}>
                <span>Set Max</span>
                <div
                  ref={switchRef}
                  className={styles['switch-container']}
                  style={{ width: SWITCH_WIDTH }}
                  onClick={handleClick}
                >
                  <div
                    ref={circleRef}
                    className={styles['switch-circle']}
                    style={{ width: CIRCLE_WIDTH }}
                  />
                </div>
              </div>
              <div className={styles['deposit-step-btn-row']}>
                <button
                  className={styles['deposit-step-btn']}
                  onClick={handleSubmit}
                >
                  {isWithdraw ? 'Withdraw' : 'Deposit'}
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  return <>{renderByDeployingState()}</>;
};

DepositStep2.defaultProps = {
  setCurrentState: undefined,
  isWithdraw: false,
  isProfile: false,
  setDepositWithdrawState: undefined,
};

export default WalletDrawer;
