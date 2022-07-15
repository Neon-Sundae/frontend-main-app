import { FC } from 'react';
import Card from 'components/Card';
import ProjectCard from '../ProjectCard';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import getRandomString from 'utils/getRandomString';

const Projects: FC = () => {
  const navigate = useNavigate();
  const { isLoading, error, data, isFetching } = useQuery('userOrgs', () =>
    fetch(`${config.ApiBaseUrl}/fl-project/new`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    }).then((response) => response.json())
  );
  if (isFetching) return <p>Loading...</p>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  return (
    <section className={styles.projects}>
      <div className={styles.header}>
        <p>New Projects</p>
        <span
          onClick={() => navigate('/project/all')}
          style={{ cursor: 'pointer', zIndex: '1' }}
        >
          View all
        </span>
      </div>
      <div className={styles.border}>
        <Card className={styles['projects-cont']} showTransparentBg={true}>
          {data.map((project: any) => (
            <ProjectCard
              key={getRandomString(5)}
              projectId={project.flProjectId}
              projectName={project.flProjectName}
              org={project.organisationName}
              description={project.flProjectDescription}
              numTasks={project.taskCount}
              location="home"
            />
          ))}
        </Card>
      </div>
    </section>
  );
};

export default Projects;
