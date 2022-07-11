import Card from 'components/Card';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import styles from './index.module.scss';

const ProjectCard = () => {
  return (
    <Card className={styles['project-card']}>
      <>
        <header>
          <BrandImage width={70} height={70} />
          <h3 className={styles['text--primary']}>Axie Infinity</h3>
          <span className={styles['text--secondary']}>Decentraland</span>
        </header>
        <p className={styles['text-content']}>
          Lorem imsum text is here imsum text is herex imsum text is here imsum
          text is here imsum...
        </p>
        <section>circles</section>
        <footer>
          <span className={styles['text-extra']}>15 tasks</span>
          <span className={clsx('material-icons', styles.icon)}>east</span>
        </footer>
      </>
    </Card>
  );
};

export default ProjectCard;
