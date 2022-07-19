import { FC } from "react";
import { useSelector } from "react-redux";
import Modal from "components/Modal";
import { RootState } from "reducers";
import { useCommitToTask } from "./hooks";
import Spinner from "components/Project/Modal/Spinner";
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { ReactComponent as CloseIcon } from 'assets/illustrations/icons/close-outlined.svg';
import styles from './index.module.scss';
import config from "config";

interface ICommitTask {
    handleClose: any;
}

const CommitTask: FC<ICommitTask> = ({ handleClose }) => {

    const { commitToTask, pending, hash } = useCommitToTask();
    const { selectedTask } = useSelector((state: RootState) => state.flProject);

    return (
        <Modal onClose={handleClose}>
            <div className={styles['commit-task-container']}>
                <h1>
                    Commit to task
                </h1>
                {
                    pending === 'initial' ? (
                        <>

                            <div>
                                <div>
                                    <span>Compensation</span>
                                    <span>{selectedTask?.price} USDC</span>
                                </div>
                                <div>
                                    <span>FNDR Coin Required</span>
                                    <span>10 FNDR</span>
                                </div>
                            </div>
                            <p>
                                <span>*Your compensation  will be unlocked after task completion</span>
                                <span>Top Up Wallet +</span>
                            </p>
                            <button onClick={() => commitToTask(selectedTask?.taskId, 10)}>Commit to task</button>
                        </>
                    ) : pending === 'approving' ? (
                        <div className={styles['accept-task-content']}>
                            <Spinner />
                            <p>Waiting for approving</p>
                            <p>Confirm this transaction in your wallet</p>
                            {
                                hash === '' ? (
                                    <p>
                                        <i className="material-icons">open_in_new</i>&nbsp;View on Explorer
                                    </p>
                                ) : (
                                    <p>
                                        <a href={`${config.explorerURL}/tx/${hash}`} target="_blank"><i className="material-icons">open_in_new</i>&nbsp;View on Explorer</a>
                                    </p>
                                )
                            }
                        </div>
                    ) : pending === 'confirming' ? (
                        <div className={styles['accept-task-content']}>
                            <Spinner />
                            <p>Waiting for confimation</p>
                            <p>Confirm this transaction in your wallet</p>
                            {
                                hash === '' ? (
                                    <p>
                                        <i className="material-icons">open_in_new</i>&nbsp;View on Explorer
                                    </p>
                                ) : (
                                    <p>
                                        <a href={`${config.explorerURL}/tx/${hash}`} target="_blank"><i className="material-icons">open_in_new</i>&nbsp;View on Explorer</a>
                                    </p>
                                )
                            }
                        </div>
                    ) : pending === 'confirmed' ? (
                        <div className={styles['accept-task-content']}>
                            <CheckIcon width={100} height={100} />
                            <p>Transaction has been confirmed</p>
                            <p>As you start working on the task, update the status to "In progress"</p>
                            {
                                hash === '' ? (
                                    <p>
                                        <i className="material-icons">open_in_new</i>&nbsp;View on Explorer
                                    </p>
                                ) : (
                                    <p>
                                        <a href={`${config.explorerURL}/tx/${hash}`} target="_blank"><i className="material-icons">open_in_new</i>&nbsp;View on Explorer</a>
                                    </p>
                                )
                            }
                        </div>
                    ) : (
                        <div className={styles['accept-task-content']}>
                            <CloseIcon width={120} height={120} />
                            <p>This Transaction has been failed</p>
                            <p>Confirm this transaction in your wallet</p>
                            {
                                hash === '' ? (
                                    <p>
                                        <i className="material-icons">open_in_new</i>&nbsp;View on Explorer
                                    </p>
                                ) : (
                                    <p>
                                        <a href={`${config.explorerURL}/tx/${hash}`} target="_blank"><i className="material-icons">open_in_new</i>&nbsp;View on Explorer</a>
                                    </p>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </Modal>
    )
}

export default CommitTask;