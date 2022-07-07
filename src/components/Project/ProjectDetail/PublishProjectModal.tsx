import { FC, Dispatch, SetStateAction, useEffect } from "react";
import Modal from "components/Modal";
import { ReactComponent as MoonPayIcon } from 'assets/illustrations/icons/moonpay.svg';
import { ReactComponent as FtxIcon } from 'assets/illustrations/icons/ftx.svg';
import { ReactComponent as WyreIcon } from 'assets/illustrations/icons/wyre.svg';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import styles from './index.module.scss';
import useProject from "./hooks";

interface IPublishProject {
    setOpen: Dispatch<SetStateAction<boolean>>;
    usdcBalance: number
}

const PublishProjectModal: FC<IPublishProject> = ({ setOpen, usdcBalance }) => {

    const { getGasFeeToPublish, publishProject } = useProject();

    useEffect(() => {
        getGasFeeToPublish();
    }, []);

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Modal onClose={handleClose}>
            {
                usdcBalance !== 0 ? (
                    <>
                        <h1 className={styles['publish-title']}>Publish your project</h1>
                        <div className={styles['publish-content-wrapper']}>
                            <div className={styles['publish-content']}>
                                <div>
                                    <span>Wallet Amount</span>
                                    <span>${usdcBalance} USDC</span>
                                </div>
                                <div>
                                    <span>Gas Fee</span>
                                    <span>$0.01 MATIC</span>
                                </div>
                                <div>
                                    <span>Deposit</span>
                                    <span>$401 USDC</span>
                                </div>
                            </div>
                            <div className={styles['publish-info']}>
                                <span className={styles['font-size--small']}>*You can always withdraw</span>
                                <span>Top Up Wallet +</span>
                            </div>
                            <button className={styles['publish-go-live']} onClick={publishProject}>Go Live</button>
                        </div>
                    </>
                ) : (
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
        </Modal>
    )
}

export default PublishProjectModal;