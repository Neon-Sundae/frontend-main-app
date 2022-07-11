import { FC } from 'react';
import TaskCard from '../TaskCard';
import styles from './index.module.scss';

const Tasks: FC = () => {
  return (
    <section className={styles.tasks}>
      <div className={styles.header}>
        <p>All Tasks</p>
        <span>View all</span>
      </div>
      <section className={styles['tasks-cont']}>
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </section>
    </section>
  );
};

export default Tasks;
