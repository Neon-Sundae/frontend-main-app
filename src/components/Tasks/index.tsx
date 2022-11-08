import { FC, useState } from 'react';
import clsx from 'clsx';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import { ReactComponent as USDCIcon } from 'assets/illustrations/icons/usdc.svg';
import Card from 'components/Card';
import MyTaskDetailModal from 'components/Home/TaskDetailModal';
import getRandomString from 'utils/getRandomString';
import styles from './index.module.scss';
import useFetchUserTasks from './hooks';

const Tasks = () => {
  const { data } = useFetchUserTasks();

  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  if (data) {
    return (
      <div className={styles['tasks-container']}>
        {data?.data?.map((d: any) => {
          console.log('d', d);
          return (
            <TaskCard
              key={d.taskId}
              title={d.title}
              organisation={d.organisation}
              estimatedDifficulty={d.estimatedDifficulty}
              price={d.price}
              organisationImage={d.organisationImage}
              categoryName={d.categoryName}
              setOpenTaskDetail={setOpenTaskDetail}
              selectedTaskId={d.taskId}
              openTaskDetail={openTaskDetail}
              taskName={d.taskName}
            />
          );
        })}
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
  organisationImage: string;
  categoryName: string;
  setOpenTaskDetail: any;
  openTaskDetail: any;
  selectedTaskId: any;
  taskName: string;
}

const TaskCard: FC<ITaskCard> = ({
  title,
  organisation,
  estimatedDifficulty,
  price,
  organisationImage,
  categoryName,
  setOpenTaskDetail,
  openTaskDetail,
  selectedTaskId,
  taskName,
}) => {
  const handleClick = () => {
    setOpenTaskDetail(true);
  };
  if (openTaskDetail) {
    return (
      <MyTaskDetailModal
        selectedTaskId={selectedTaskId}
        setOpen={setOpenTaskDetail}
        key={getRandomString(5)}
      />
    );
  }
  return (
    <div className={styles.container}>
      <Card
        className={styles['task-card']}
        showTransparentBg
        width="100%"
        height="auto"
        borderType="0.7px solid rgb(224, 185, 255)"
        onClick={() => handleClick()}
      >
        <div className={styles['task-card-content-container']}>
          <div className={styles['task-card-image-column']}>
            <div className={styles['task-card-image-wrapper']}>
              {organisationImage ? (
                <img alt="logo" src={organisationImage} />
              ) : (
                <BrandImage width={68} height={68} />
              )}
            </div>
          </div>
          <div className={styles['task-card-content-column']}>
            <div className={styles['profile-category-container']}>
              <p className={styles['category-text']}>{categoryName}</p>
            </div>

            <h4 className={styles['task-card-title']}>{taskName}</h4>
            <p className={styles['task-card-organisation']}>{organisation}</p>
            <div className={styles['rating-price-row']}>
              <div>
                {[...Array(estimatedDifficulty).keys()].map(n => (
                  <i
                    key={n}
                    className={clsx('material-icons', styles['rating-star'])}
                  >
                    star
                  </i>
                ))}
              </div>
              <div className={styles['task-card-usdc-container']}>
                <USDCIcon className={styles['task-card-usdc-icon']} />
                <p>{price} USDC </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tasks;
