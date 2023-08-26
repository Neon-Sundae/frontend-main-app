import ProjectCardWithPeople from 'components/ProjectCardWithPeople';
import { OrganisationProjects } from 'interfaces/organisation';
import { FC } from 'react';
import styles from './index.module.scss';

interface IProjectsTab {
  flProjects: OrganisationProjects[];
}

const ProjectsTab: FC<IProjectsTab> = ({ flProjects }) => {
  return (
    <div className={styles['projects-tab']}>
      {flProjects.map((flProject: OrganisationProjects) => (
        <ProjectCardWithPeople flProject={flProject} />
      ))}
    </div>
  );
};

export default ProjectsTab;
