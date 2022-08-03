/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { IOrganisation } from 'interfaces/organisation';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import styles from './index.module.scss';
import ProjectCard from '../../../components/Home/ProjectCard/index';

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
                key={flProject.flProject_uuid}
                projectId={flProject.flProject_uuid}
                description={flProject.flProjectDescription}
                numTasks={flProject.taskCount}
                projectName={flProject.flProjectName}
                org={organisation.name}
                organisationImage={organisation.profileImage}
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
  organisationImage?: string;
}

const OrganisationProjectCard: FC<IOrganisationProjectCard> = ({
  projectId,
  description,
  numTasks,
  org,
  projectName,
  organisationImage,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div onClick={handleNavigation}>
      <ProjectCard
        projectId={projectId}
        description={description}
        org={org}
        numTasks={numTasks}
        projectName={projectName}
        orgImage={organisationImage}
        location="organisation"
        width="200px"
      />
    </div>
  );
};

export default OrganisationProjects;
