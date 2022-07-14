import { FC } from 'react';
import TaskCard from '../TaskCard';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';

const Tasks: FC<any> = (props: any) => {
  const navigate = useNavigate();
  return (
    <section className={styles.tasks}>
      <div className={styles.header}>
        <p>All Tasks</p>

        <span
          onClick={() => navigate('/tasks/all')}
          style={{ cursor: 'pointer' }}
        >
          View all
        </span>
      </div>
      <section className={styles['tasks-cont']}>
        {props.data.map((task: any) => (
          <TaskCard key={task.id} data={task} width={'30vw'} />
        ))}
      </section>
    </section>
  );
};

export default Tasks;
