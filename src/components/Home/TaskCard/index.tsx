import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import Card from 'components/Card';
import useBuilderTaskApply from 'hooks/useBuilderTaskApply';
import styles from './index.module.scss';

const TaskCard = (props: any) => {
  const { width, height, data, location } = props;
  const builderTaskApply = useBuilderTaskApply();

  const applyToTask = () => {
    builderTaskApply.mutate({
      taskId: data.taskId,
    });
  };

  if (location === 'home') {
    return (
      <>
        <Card
          showTransparentBg
          width={width}
          height={height}
          borderType="0.7px solid #e0b9ff"
        >
          <div className={styles.wrapper}>
            <div className={styles.content}>
              <div className={styles.catWrap}>
                <p className={styles.cat}>
                  {data.flProjectCategory.categoryName}
                </p>
              </div>
              <div className={styles.wrapContent}>
                <h4
                  style={{
                    fontSize: '14px',
                  }}
                >
                  {data.name}
                </h4>
                <p>{data.flProjectCategory.flProject.name}</p>
                {Array.from({ length: data.estimatedDifficulty }).map(
                  (_, index) => (
                    <i
                      key={index}
                      className={clsx('material-icons', styles['rating-star'])}
                    >
                      star
                    </i>
                  )
                )}
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.col}>
                <div
                  style={{ cursor: 'pointer', fontSize: '12px' }}
                  onClick={applyToTask}
                >
                  Apply to task
                </div>
                <div className={styles.row}>
                  <div
                    className={styles.dot}
                    style={{
                      background: '#FFB9C2',
                      top: '88px',
                      left: '65px',
                    }}
                  />
                  <p>{data.price} USDC </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <br />
      </>
    );
  }
  return (
    <>
      <Card
        showTransparentBg
        width={width || '888px'}
        height={height}
        borderType="0.7px solid #e0b9ff"
      >
        <div className={styles.wrapper}>
          {data.flProjectCategory.flProject.organisation.profileImage ? (
            <img
              src={data.flProjectCategory.flProject.organisation.profileImage}
              className={styles.img}
              alt="organisation"
            />
          ) : (
            <BrandImage width={130} height={130} />
          )}
          <div className={styles.content}>
            <div className={styles.content} style={{ width: '100px' }} />
            <div className={styles.catWrap}>
              <p className={styles.cat}>
                {data.flProjectCategory.categoryName}
              </p>
            </div>
            <div className={styles.wrapContent}>
              <h4>{data.name}</h4>
              <p>{data.flProjectCategory.flProject.name}</p>
              {Array.from({ length: data.estimatedDifficulty }).map(
                (_, index) => (
                  <i
                    key={index}
                    className={clsx('material-icons', styles['rating-star'])}
                  >
                    star
                  </i>
                )
              )}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.col}>
              <div
                style={{ cursor: 'pointer', fontSize: '14px' }}
                onClick={applyToTask}
              >
                Apply to task
              </div>
              <div className={styles.row}>
                <div
                  className={styles.dot}
                  style={{
                    background: '#FFB9C2',
                    top: '89px',
                    right: '17%',
                  }}
                />
                <p>{data.price} USDC </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <br />
    </>
  );
};

export default TaskCard;
