import { Dispatch, FC, SetStateAction } from "react";
import Modal from "components/Modal";
import Spinner from "components/Project/Modal/Spinner";
import { ReactComponent as FailedIcon } from 'assets/illustrations/icons/failed.svg';
import { ReactComponent as SugarIcon } from 'assets/illustrations/icons/sugar.svg';
import styles from './index.module.scss';
import useCompleteTask from "./hooks";
import { useSelector } from "react-redux";
import { RootState } from "reducers";

interface ISelectBuilder {
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const CompleteTask: FC<ISelectBuilder> = ({ setOpen }) => {

    const { pending, setPending, completeTask } = useCompleteTask();
    const handleClose = () => setOpen(false);

    const { selectedTask } = useSelector((state: RootState) => state.flProject);

    return (
        <Modal width="420px" onClose={handleClose}>
            <div className={styles['complete-task-container']}>
                {
                    pending === 'initial' ? (
                        <div className={styles['important-content']}>
                            <p>Important!</p>
                            <p>Once you move your task from In-Review to Completed and it cannot be changed and the payment to the builder will be made. In next step you will make a transaction.</p>
                            <button onClick={() => completeTask(selectedTask?.taskSmartContractId)}>Next</button>
                        </div>
                    ) : pending === 'confirming' ? (
                        <div className={styles['confirming-content']}>
                            <Spinner />
                            <p>Confirmation</p>
                            <p>Approve transaction in your wallet</p>
                        </div>
                    ) : pending === 'confirmed' ? (
                        <div className={styles['confirming-content']}>
                            <SugarIcon width={120} height={120} />
                            <p>Succesfull!</p>
                            <p>The transaction has beed succesfull. </p>
                        </div>
                    ) : (
                        <div className={styles['confirming-content']}>
                            <FailedIcon width={100} height={100} />
                            <p>Something went wronged</p>
                            <p>The transaction has failded.Please try again. </p>
                        </div>
                    )
                }
            </div>
        </Modal>
    )
}

export default CompleteTask;