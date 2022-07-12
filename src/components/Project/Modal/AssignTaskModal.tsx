import { FC, Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import Modal from "components/Modal";
import styles from './index.module.scss';

interface IAssignTask {
    setOpen: Dispatch<SetStateAction<boolean>>;

}

const AssignTaskModal: FC<IAssignTask> = ({ setOpen }) => {

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Modal onClose={handleClose}>
            <div className={styles['assign-task-container']}>
                <h2 className={styles['project-name']}>UI Design Moodboard</h2>
                <h6 className={styles['founder-name']}>Axie Infinity</h6>
                <div className={styles['avatar-container']}>
                    <button>Open</button>
                    <div>
                        <div className={styles['builder-avatar']}></div>
                        <div className={styles['builder-avatar']}></div>
                        <div className={styles['builder-avatar']}></div>
                    </div>
                </div>
                <div className={styles['project-details']}>
                    <div>
                        <div>Project: NFT Project</div>
                        <div><i className={clsx('material-icons', styles['rating-star'])}>star</i>&nbsp;Difficulty:
                            <i className={clsx('material-icons', styles['rating-star'])}>star</i>
                            <i className={clsx('material-icons', styles['rating-star'])}>star</i>
                            <i className={clsx('material-icons', styles['rating-star'])}>star</i>
                            <i className={clsx('material-icons', styles['rating-star'])}>star</i>
                            <i className={clsx('material-icons', styles['rating-star'])}>star</i>
                        </div>
                    </div>
                    <div>
                        <div>Category: UI/UX Designing</div>
                        <div>Value: 250 USDC</div>
                    </div>
                    <div>
                        <div>XP Point: 180XP</div>
                        <div>Burned: 120</div>
                    </div>
                </div>
                <div className={styles['project-description']}>
                    <p>
                        Lorem imsum text is here imsum text is here   imsum text is here imsum text is here imsum. BioLorem imsum text is here imsum text is here   imsum text is here imsum text is here imsum. BioLorem imsum text is here imsum text is here text is
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export default AssignTaskModal;