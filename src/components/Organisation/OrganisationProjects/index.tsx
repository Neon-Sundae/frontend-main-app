/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { IOrganisation } from 'interfaces/organisation';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import styles from './index.module.scss';

interface IOrganisationProjects {
  organisation: IOrganisation;
}

const OrganisationProjects: FC<IOrganisationProjects> = ({ organisation }) => {
  const { flProjects } = organisation;

  return (
    <div className={styles['organisation-projects-container']}>
      <h3 className={styles['organisation-heading']}>Projects</h3>
      <div className={styles['organisation-project-cards-container']}>
        {flProjects.length > 0
          ? flProjects.map(flProject => (
              <OrganisationProjectCard
                key={flProject.flProjectId_uuid}
                projectId={flProject.flProjectId_uuid}
                description={flProject.flProjectDescription}
                numTasks={flProject.taskCount}
                projectName={flProject.flProjectName}
                org={organisation.name}
              />
            ))
          : null}
      </div>
    </div>
  );
};

interface IOrganisationProjectCard {
  projectName: string;
  org: string;
  description: string;
  numTasks: number;
  projectId: string;
}

const OrganisationProjectCard: FC<IOrganisationProjectCard> = ({
  projectId,
  description,
  numTasks,
  org,
  projectName,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div
      className={styles['organisation-project-card']}
      onClick={handleNavigation}
    >
      <header>
        <BrandImage width={70} height={70} />
        <h3 className={styles['text--primary']}>{projectName}</h3>
        <span className={styles['text--secondary']}>{org}</span>
      </header>
      <p className={styles['text-content']}>{description}</p>

      <footer>
        <span className={styles['text-extra']}>{numTasks} tasks</span>
        <span className={clsx('material-icons', styles.icon)}>east</span>
      </footer>
    </div>
  );
};

export default OrganisationProjects;
