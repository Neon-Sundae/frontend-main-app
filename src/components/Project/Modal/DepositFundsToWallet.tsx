import { ReactComponent as MoonPayIcon } from 'assets/illustrations/icons/moonpay.svg';
import { ReactComponent as FtxIcon } from 'assets/illustrations/icons/ftx.svg';
import { ReactComponent as WyreIcon } from 'assets/illustrations/icons/wyre.svg';
import { ReactComponent as TransakIcon } from 'assets/illustrations/icons/transak.svg';
import styles from './index.module.scss';

const DepositFundsToWallet = () => {
  return (
    <>
      <h1 className={styles['deposit-title']}>Deposit Funds to your wallet</h1>
      <div className={styles['deposit-content-wrapper']}>
        <a
          href="https://www.moonpay.com/buy"
          target="_blank"
          className={styles['wallet-item']}
          rel="noreferrer"
        >
          <div className={styles['icon-holder']}>
            <MoonPayIcon width={43} height={43} style={{ marginTop: '3px' }} />
          </div>
          <div>
            <span>MoonPay</span>
          </div>
        </a>
        <a
          href="https://ftx.com"
          target="_blank"
          className={styles['wallet-item']}
          rel="noreferrer"
        >
          <div className={styles['icon-holder']}>
            <FtxIcon width={43} height={43} style={{ marginTop: '3px' }} />
          </div>
          <div>
            <span>FTX</span>
          </div>
        </a>
        <a
          href="https://www.sendwyre.com/"
          target="_blank"
          className={styles['wallet-item']}
          rel="noreferrer"
        >
          <div className={styles['icon-holder']}>
            <WyreIcon width={43} height={43} style={{ marginTop: '3px' }} />
          </div>
          <div>
            <span>Wyre</span>
          </div>
        </a>
        <div className={styles['wallet-item']}>
          <div className={styles['icon-holder']}>
            <TransakIcon width={43} height={43} style={{ marginTop: '3px' }} />
          </div>
          <div>
            <span>Transak</span>
          </div>
        </div>
      </div>
      <p className={styles['deposit-bottom-text']}>
        On clicking one service you will be redicted to partner website
      </p>
    </>
  );
};

export default DepositFundsToWallet;
