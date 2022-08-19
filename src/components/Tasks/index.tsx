import { FC } from 'react';
import clsx from 'clsx';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import { ReactComponent as USDCIcon } from 'assets/illustrations/icons/usdc.svg';
import Card from 'components/Card';
import styles from './index.module.scss';
import useFetchUserTasks from './hooks';

const Tasks = () => {
  const { data } = useFetchUserTasks();

  if (data) {
    return (
      <div className={styles['tasks-container']}>
        {data?.data?.map((d: any) => (
          <TaskCard
            key={d.taskId}
            title={d.title}
            organisation={d.organisation}
            estimatedDifficulty={d.estimatedDifficulty}
            price={d.price}
            organisationImage={d.organisationImage}
            categoryName={d.categoryName}
          />
        ))}
      </div>
    );
  }
  return null;
};

interface ITaskCard {
  title: string;
  organisation: string;
  estimatedDifficulty: number;
  price: number;
  organisationImage: JSX.Element;
  categoryName: string;
}

const TaskCard: FC<ITaskCard> = ({
  title,
  organisation,
  estimatedDifficulty,
  price,
  organisationImage,
  categoryName,
}) => {
  const applyToTask = () => {};
  return (
    <div className={styles.container}>
      <Card
        className={styles['task-card']}
        showTransparentBg
        width="100%"
        height="auto"
      >
        {/* <div className={styles['profile-category-container']}>
          <p className={styles['category-text']}>{categoryName}</p>
        </div> */}
        <div className={styles.wrapper}>
          <div className={styles.content} style={{ width: '100px' }}>
            <BrandImage width={68} height={68} />
          </div>
          <div className={styles.content} style={{ lineHeight: '2rem' }}>
            <h4 className={styles['task-card-title']}>{title}</h4>
            <p className={styles['task-card-organisation']}>{organisation}</p>
            {Array.from({ length: estimatedDifficulty }).map((_, index) => (
              <i
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={clsx('material-icons', styles['rating-star'])}
              >
                star
              </i>
            ))}
          </div>
          <div
            className={styles.content}
            style={{ width: '200px', display: 'flex' }}
          >
            <USDCIcon className={styles['task-card-usdc-icon']} />
            <p>{price} USDC </p>
          </div>
          <div
            className={styles.content}
            style={{ width: '200px', cursor: 'pointer' }}
            onClick={applyToTask}
          >
            Apply to task
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tasks;
