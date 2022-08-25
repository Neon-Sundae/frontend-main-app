import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import { ReactComponent as USDCIcon } from 'assets/illustrations/icons/usdc.svg';
import clsx from 'clsx';
import Card from 'components/Card';
import useBuilderTaskApply from 'hooks/useBuilderTaskApply';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

const TaskCard = (props: any) => {
  const { width, height, data, location } = props;
  const builderTaskApply = useBuilderTaskApply();
  const navigate = useNavigate();
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
                  <USDCIcon
                    className={styles.dot}
                    style={{
                      top: '89px',
                      marginRight: '5px',
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
        <div
          className={styles.wrapper}
          style={{ marginLeft: '55px', marginRight: '55px' }}
        >
          {data.flProjectCategory.flProject.organisation.profileImage ? (
            <div
              className={styles.orgImgWrap}
              onClick={() =>
                navigate(
                  `/project/${data.flProjectCategory.flProject.flProjectId_uuid}`
                )
              }
            >
              <img
                src={data.flProjectCategory.flProject.organisation.profileImage}
                className={styles.img}
                alt="organisation"
              />
            </div>
          ) : (
            <BrandImage
              width={170}
              height={170}
              style={{
                borderRadius: '50%',
              }}
            />
          )}
          <div
            className={styles.content}
            onClick={() =>
              navigate(
                `/project/${data.flProjectCategory.flProject.flProjectId_uuid}`
              )
            }
          >
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
                <USDCIcon
                  style={{
                    top: '89px',
                    marginRight: '5px',
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
