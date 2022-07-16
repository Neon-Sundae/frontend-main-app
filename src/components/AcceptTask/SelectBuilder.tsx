import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useSelector } from "react-redux";
import Modal from "components/Modal";
import Spinner from "components/Project/Modal/Spinner";
import { useSelectBuilder } from "./hooks";
import { RootState } from "reducers";
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { ReactComponent as CloseIcon } from 'assets/illustrations/icons/close-outlined.svg';
import styles from './index.module.scss';

interface ISelectBuilder {
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleSuccess: any;
    project_budget: number;
    selectedBuilder: any;
    data: any;
}

const SelectBuilder: FC<ISelectBuilder> = ({ setOpen, handleSuccess, project_budget, selectedBuilder, data }) => {

    const { selectBuilder, pending } = useSelectBuilder();

    const { selectedProjectAddress } = useSelector((state: RootState) => state.flProject);

    useEffect(() => {
        if (pending === 'confirmed') {
            setTimeout(() => {
                handleSuccess();
            }, 2000);
        }
    }, [pending]);

    const handleClose = () => setOpen(false);

    const handleSelect = () => {
        // TODO: will change xp value with db data
        selectBuilder(selectedProjectAddress, selectedBuilder.walletId, data.name, data.price, 180);
    }

    return (
        <Modal onClose={handleClose}>
            <div className={styles['select-builder-container']}>
                <h1 style={{ textAlign: (pending === 'confirmed' || pending === 'failed') ? 'center' : 'left' }}>
                    {pending === 'confirmed' ? 'Complete' : pending === 'failed' ? 'Failed' : 'Select Builder'}
                </h1>
                {
                    pending === 'initial' ? (
                        <>
                            <div>
                                <div>
                                    <span>Project Amount</span>
                                    <span>{project_budget} USDC</span>
                                </div>
                                <div>
                                    <span>Amount Required</span>
                                    <span>{data?.price} USDC</span>
                                </div>
                            </div>
                            <p>
                                <span>*Amount required to compensate builder</span>
                                <span>Top Up Wallet +</span>
                            </p>
                            <button onClick={handleSelect}>Select</button>
                        </>
                    ) : pending === 'waiting' ? (
                        <div className={styles['accept-task-content']}>
                            <Spinner />
                            <p>Waiting for confimation</p>
                            <p>Confirm this transaction in your wallet</p>
                        </div>
                    ) : pending === 'confirmed' ? (
                        <div className={styles['accept-task-content']}>
                            <CheckIcon width={100} height={100} />
                            <p>Builder selected succesfully!</p>
                            <p>We’ve sent Builder an update on email & Discord  </p>
                        </div>
                    ) : (
                        <div className={styles['accept-task-content']}>
                            <CloseIcon width={120} height={120} />
                            <p>This Transaction has been failed due to low balance</p>
                            <p>Task cannot be deployed as it exceeds project budget  </p>
                            <button onClick={handleSelect}>Add Funds</button>
                        </div>
                    )
                }
            </div>
        </Modal>
    )
}

export default SelectBuilder;