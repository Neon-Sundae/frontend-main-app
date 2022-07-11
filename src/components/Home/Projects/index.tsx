import { FC } from 'react';
import Card from 'components/Card';
import ProjectCard from '../ProjectCard';
import styles from './index.module.scss';

const Projects: FC = () => {
  return (
    <section className={styles.projects}>
      <div className={styles.header}>
        <p>New Projects</p>
        <span>View all</span>
      </div>
      <Card className={styles['projects-cont']}>
        <>
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </>
      </Card>
    </section>
  );
};

export default Projects;
