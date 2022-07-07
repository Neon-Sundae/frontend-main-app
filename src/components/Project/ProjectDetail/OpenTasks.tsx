import { ReactComponent as DummyImage1 } from 'assets/illustrations/task/task-dummy-1.svg';
import { ReactComponent as DummyImage2 } from 'assets/illustrations/task/task-dummy-2.svg';
import styles from './index.module.scss';
import TaskCard from './TaskCard';

const data = [
    {
        taskId: 1,
        title: 'UI Design_Moodboard Creation',
        organisation: 'Axie Infinity',
        estimatedDifficulty: 5,
        price: 100,
        organisationImage: <DummyImage1 width={74} height={74} />,
    },
    {
        taskId: 2,
        title: 'UI Design_Moodboard Creation',
        organisation: 'Axie Infinity',
        estimatedDifficulty: 3,
        price: 100,
        organisationImage: <DummyImage2 width={74} height={74} />,
    },
    {
        taskId: 3,
        title: 'UI Design_Moodboard Creation',
        organisation: 'Axie Infinity',
        estimatedDifficulty: 1,
        price: 100,
        organisationImage: <DummyImage1 width={74} height={74} />,
    },
    {
        taskId: 4,
        title: 'UI Design_Moodboard Creation',
        organisation: 'Axie Infinity',
        estimatedDifficulty: 1,
        price: 100,
        organisationImage: <DummyImage1 width={74} height={74} />,
    },
];

const OpenTasks = () => {
    return (
        <div className={styles['task-steps']}>
            <TaskCard />
        </div>
    )
}

export default OpenTasks;