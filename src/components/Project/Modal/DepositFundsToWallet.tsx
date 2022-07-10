import { ReactComponent as MoonPayIcon } from 'assets/illustrations/icons/moonpay.svg';
import { ReactComponent as FtxIcon } from 'assets/illustrations/icons/ftx.svg';
import { ReactComponent as WyreIcon } from 'assets/illustrations/icons/wyre.svg';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import styles from './index.module.scss';

const DepositFundsToWallet = () => {
    return (
        <>
            <h1 className={styles['deposit-title']}>Deposit Funds to your wallet</h1>
            <div className={styles['deposit-content-wrapper']}>
                <div className={styles['wallet-item']}>
                    <MoonPayIcon width={43} height={40} />
                    <span>MoonPay</span>
                </div>
                <div className={styles['wallet-item']}>
                    <FtxIcon width={43} height={40} />
                    <span>FTX</span>
                </div>
                <div className={styles['wallet-item']}>
                    <WyreIcon width={43} height={40} />
                    <span>Wyre</span>
                </div>
                <div className={styles['wallet-item']}>
                    <MetamaskIcon width={43} height={40} />
                    <span>Metamask</span>
                </div>
                <button className={styles['deposit-top-up']}>Top Up</button>
                <p className={styles['deposit-bottom-text']}>On clicking one service you will be redicted to partner website</p>
            </div>
        </>
    )
}

export default DepositFundsToWallet;