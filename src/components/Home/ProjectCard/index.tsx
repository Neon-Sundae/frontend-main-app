import Card from 'components/Card';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import styles from './index.module.scss';

interface ProjectCardProps {
  projectName: string;
  description: string;
  org: string;
  numTasks: number;
  projectId: string;
  location?: string;
  width?: string;
}

const ProjectCard: FC<ProjectCardProps> = ({
  projectName,
  description,
  org,
  numTasks,
  projectId,
  location,
  width,
}) => {
  const navigate = useNavigate();

  if (location === 'home') {
    return (
      <Card
        className={styles['project-card']}
        showTransparentBg
        width={width}
        marginRight={'50px'}
      >
        <>
          <header>
            <BrandImage width={70} height={70} />
            <h3 className={styles['text--primary']}>{projectName}</h3>
            <span className={styles['text--secondary']}>{org}</span>
          </header>
          <p className={styles['text-content']}>{description}</p>

          <footer
            onClick={() => {
              navigate(`/project/${projectId}`);
            }}
          >
            <span className={styles['text-extra']}>{numTasks} tasks</span>
            <span className={clsx('material-icons', styles.icon)}>east</span>
          </footer>
        </>
      </Card>
    );
  }
  return (
    <Card className={styles['project-card']} showTransparentBg width={width}>
      <>
        <header>
          <BrandImage width={70} height={70} />
          <h3 className={styles['text--primary']}>{projectName}</h3>
          <span className={styles['text--secondary']}>{org}</span>
        </header>
        <p className={styles['text-content']}>{description}</p>

        <footer
          onClick={() => {
            navigate(`/project/${projectId}`);
          }}
        >
          <span className={styles['text-extra']}>{numTasks} tasks</span>
          <span className={clsx('material-icons', styles.icon)}>east</span>
        </footer>
      </>
    </Card>
  );
};

ProjectCard.defaultProps = {
  width: '215px',
  location: 'home',
};

export default ProjectCard;
