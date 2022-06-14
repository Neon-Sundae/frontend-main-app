import { FC } from 'react';
import clsx from 'clsx';
import { ReactComponent as DummyImage1 } from 'assets/illustrations/task/task-dummy-1.svg';
import { ReactComponent as DummyImage2 } from 'assets/illustrations/task/task-dummy-2.svg';
import userImg from 'assets/images/profile/user-image.png';
import styles from './index.module.scss';

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

const Tasks: FC = () => {
  return (
    <div className={styles['tasks-container']}>
      {data.map(d => (
        <TaskCard
          key={d.taskId}
          title={d.title}
          organisation={d.organisation}
          estimatedDifficulty={d.estimatedDifficulty}
          price={d.price}
          organisationImage={d.organisationImage}
        />
      ))}
    </div>
  );
};

interface ITaskCard {
  title: string;
  organisation: string;
  estimatedDifficulty: number;
  price: number;
  organisationImage: JSX.Element;
}

const TaskCard: FC<ITaskCard> = ({
  title,
  organisation,
  estimatedDifficulty,
  price,
  organisationImage,
}) => {
  return (
    <div className={styles['task-card']}>
      <div>{organisationImage}</div>
      <div className={styles['card-content']}>
        <h3 className={styles['task-title']}>{title}</h3>
        <div className={styles['content-container']}>
          <div className={styles['rating-container']}>
            <h5>{organisation}</h5>
            <span>
              {[...Array(estimatedDifficulty).keys()].map(n => (
                <i
                  key={n}
                  className={clsx('material-icons', styles['rating-star'])}
                >
                  star
                </i>
              ))}
            </span>
          </div>
          <div className={styles['price-container']}>
            <div />
            <span>{price} USDC</span>
          </div>
          <div className={styles['profile-image-wrapper']}>
            <img alt="user" src={userImg} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
