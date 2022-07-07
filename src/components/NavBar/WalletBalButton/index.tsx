import { FC, useState } from 'react';
import Web3 from 'web3';
import { ReactComponent as WalletIcon } from 'assets/illustrations/icons/wallet.svg';
import { ReactComponent as VisibilityIcon } from 'assets/illustrations/icons/visibility.svg';
import { ReactComponent as WithdrawIcon } from 'assets/illustrations/icons/withdraw.svg';
import clsx from 'clsx';
import styles from './index.module.scss';
import useWithdrawFund from './hooks';

interface WalletButtonProps {
  usdcBalance: number,
  profileAddress: string
}

const WalletBalButton: FC<WalletButtonProps> = (props) => {

  const [openWithdraw, setOpenWithdraw] = useState(false);

  const { withdrawFund } = useWithdrawFund()

  const handleWithdraw = () => {
    if (props.usdcBalance === 0) {
      alert("Zero Balance");
    } else {
      withdrawFund(props.profileAddress);
    }
    setOpenWithdraw(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.balance} onClick={() => setOpenWithdraw(!openWithdraw)}>
        <div className={styles.icon}>
          <WalletIcon width={28} height={28} />
        </div>
        <div className={styles.content}>
          <div
            className={clsx(
              styles['text--primary'],
              styles['text--align'],
              styles['text--clickable']
            )}
          >
            <span>{Number(Web3.utils.fromWei(props.usdcBalance.toString(), 'ether')).toLocaleString()} usdc</span>
            <span className="material-icons">keyboard_arrow_down</span>
          </div>
          <span
            className={clsx(
              styles['text--secondary'],
              styles['text--clickable'],
              styles['text--align']
            )}
          >
            Hide balance
            <VisibilityIcon width={15} height={15} />
          </span>
        </div>
      </div>
      {
        openWithdraw && (
          <div className={styles.withdraw} onClick={handleWithdraw}>
            <WithdrawIcon width={30} height={20} />
            <span>Withdraw</span>
          </div>
        )
      }
    </div>
  );
};

export default WalletBalButton;
