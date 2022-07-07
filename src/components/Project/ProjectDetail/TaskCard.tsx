import { ReactComponent as StarIcon } from 'assets/illustrations/icons/star.svg';
import { ReactComponent as EllipseIcon } from 'assets/illustrations/icons/ellipse.svg';
import styles from './index.module.scss';

const TaskCard = () => {
    return (
        <div className={styles['task-container']}>
            <div className={styles['task-tools']}>
                <div className={styles['task-tools-left']}>Content Writing</div>
                <div className={styles['task-tools-right']}>Apply to task</div>
            </div>
            <div className={styles['task-title']}>UI Design_Moodboard Creation</div>
            <div className={styles['task-content']}>Axie Infinity</div>
            <div className={styles['task-star-cost-container']}>
                <div className={styles.flex}>
                    <StarIcon width={22} height={22} />&nbsp;
                    <StarIcon width={22} height={22} />&nbsp;
                    <StarIcon width={22} height={22} />&nbsp;
                    <StarIcon width={22} height={22} />
                </div>
                <div className={styles['task-cost']}>
                    <EllipseIcon width={22} height={22} />&emsp;100 USDC
                </div>
            </div>
        </div>
    )
}

export default TaskCard;