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
                <a href='https://www.moonpay.com/buy' target="_blank" className={styles['wallet-item']}>
                    <MoonPayIcon width={43} height={40} />
                    <span>MoonPay</span>
                </a>
                <a href='https://ftx.com' target="_blank" className={styles['wallet-item']}>
                    <FtxIcon width={43} height={40} />
                    <span>FTX</span>
                </a>
                <a href='https://www.sendwyre.com/' target="_blank" className={styles['wallet-item']}>
                    <WyreIcon width={43} height={40} />
                    <span>Wyre</span>
                </a>
                <div className={styles['wallet-item']}>
                    <TransakIcon width={43} height={40} />
                    <span>Transak</span>
                </div>
                <button className={styles['deposit-top-up']}>Top Up</button>
                <p className={styles['deposit-bottom-text']}>On clicking one service you will be redicted to partner website</p>
            </div>
        </>
    )
}

export default DepositFundsToWallet;