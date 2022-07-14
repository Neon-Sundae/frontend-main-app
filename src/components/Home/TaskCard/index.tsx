import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import Card from 'components/Card';
import styles from './index.module.scss';

const TaskCard = (props: any) => {
  const { width, height, data } = props;

  return (
    <Card
      className={styles['task-card']}
      showTransparentBg={true}
      width={width}
      height={height}
    >
      <div className={styles.wrapper}>
        <div className={styles.content} style={{ width: '100px' }}>
          <BrandImage width={95} height={95} />
        </div>
        <div className={styles.content} style={{ lineHeight: '2rem' }}>
          <h4>{data.name}</h4>
          <p>{data.flProjectCategory.flProject.name}</p>
          {Array.from({ length: data.estimatedDifficulty }).map((_, index) => (
            <i
              key={index}
              className={clsx('material-icons', styles['rating-star'])}
            >
              star
            </i>
          ))}
        </div>
        <div className={styles.content} style={{ width: '200px' }}>
          <div className={styles.dot}> </div>
          <p>{data.price} USDC </p>
        </div>
        <div className={styles.content} style={{ width: '200px' }}>
          Apply to task
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
