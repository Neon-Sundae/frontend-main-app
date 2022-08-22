import Card from 'components/Card';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import styles from './index.module.scss';
import useFetchUserProjects from './hooks';

const ProjectsCard = () => {
  const { flProjects, isLoading } = useFetchUserProjects();
  const navigate = useNavigate();

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles['profile-project-container']}>
      {flProjects?.map((project: any) => {
        return (
          <div
            onClick={() => {
              navigate(`/project/${project.id}`);
            }}
            style={{ cursor: 'pointer' }}
            key={project.id}
          >
            <Card
              className={styles['project-card']}
              showTransparentBg
              width="189.95px"
            >
              <header>
                {project.image ? (
                  <div className={styles['profile-project-image-wrapper']}>
                    <img src={project.image} alt="Organisation logo" />
                  </div>
                ) : (
                  <BrandImage width={60} height={60} />
                )}
                <h5 className={styles['profile-project-organisation']}>
                  {project.organisation}
                </h5>
                <h3 className={styles['profile-project-title']}>
                  {project.name}
                </h3>
              </header>
              <p className={styles['profile-project-description']}>
                {project.description}
              </p>
              <footer>
                <span className={styles['text-extra']}>
                  {project.taskCount} tasks
                </span>
                <span className={clsx('material-icons', styles.icon)}>
                  east
                </span>
              </footer>
            </Card>
          </div>
        );
      })}
      {flProjects.length === 0 && <p>No Projects</p>}
    </div>
  );
};

export default ProjectsCard;
