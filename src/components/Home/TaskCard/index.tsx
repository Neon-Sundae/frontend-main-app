import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import Card from 'components/Card';
import styles from './index.module.scss';

const TaskCard = () => {
  return (
    <Card className={styles['task-card']}>
      <>
        <section className={styles.content}>
          <p className={styles['text--primary']}>
            UI Design_Moodboard Creation
          </p>
          <p className={styles['text--secondary']}>Axie Infinity</p>
          <section className={styles.stats}>
            <span>
              <span className={clsx('material-icons', styles.icon)}>
                schedule
              </span>
              2hrs
            </span>
            <span>
              <span className={clsx(styles.icon, styles.circle)} />
              10
            </span>
          </section>
        </section>
        <section className={styles.extra}>
          <BrandImage width={45} height={45} />
          <p className={styles['text--secondary']}>Apply to task</p>
        </section>
      </>
    </Card>
  );
};

export default TaskCard;
