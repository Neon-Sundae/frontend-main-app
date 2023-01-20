/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { IOrganisation } from 'interfaces/organisation';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import StartPrjModal from 'components/StartPrjModal';
import CreateUsingProjectTemplate from 'components/StartPrjModal/CreateUsingProjectTemplate';
import styles from './index.module.scss';
import ProjectCard from '../../../components/Home/ProjectCard/index';

interface IOrganisationProjects {
  organisation: IOrganisation;
  showAddBtn?: boolean;
}

const OrganisationProjects: FC<IOrganisationProjects> = ({
  organisation,
  showAddBtn,
}) => {
  const [showCreateProject, setShowProjectCreate] = useState(false);
  const [checkIfNumber, setCheckIfNumber] = useState<any>(null);
  const { flProjects } = organisation;

  useEffect(() => {
    const checkIfNum = location.pathname.split('/').pop() || '';
    const num = checkIfNum.replace(/[^0-9]/g, '');
    if (num.length) setCheckIfNumber(num.length);
  }, []);

  const location = useLocation();
  const subpage = location.pathname.split('/').pop();
  return (
    <div className={styles['organisation-projects-container']}>
      {showAddBtn && (
        <span
          className={styles['organisation-projects-container--new-projects']}
        >
          <h3 className={styles['organisation-heading']}>Projects</h3>
          <button onClick={() => setShowProjectCreate(true)}>
            Add new
            <i className={clsx('material-icons', styles['add-icon'])}>add</i>
          </button>
        </span>
      )}

      {showCreateProject && (
        <CreateUsingProjectTemplate
          onClose={() => setShowProjectCreate(false)}
          onNext={() => {}}
          orgId={organisation.organisationId}
          directShowProjectCreate
        />
      )}

      {!showCreateProject && (
        <div
          className={clsx(
            subpage === 'home'
              ? styles['organisation-project-cards-container']
              : styles['organisation-project-cards-container-alternate']
          )}
        >
          {flProjects.length > 0
            ? flProjects.map(flProject => (
                <OrganisationProjectCard
                  key={flProject.flProject_uuid}
                  projectId={flProject.flProject_uuid}
                  description={flProject.flProjectDescription}
                  numTasks={flProject.taskCount}
                  projectName={flProject.flProjectName}
                  org={organisation.name}
                  profileImage={organisation.profileImage}
                />
              ))
            : null}
        </div>
      )}
    </div>
  );
};

interface IOrganisationProjectCard {
  projectName: string;
  org: string;
  description: string;
  numTasks: number;
  projectId: string;
  profileImage?: string | null;
}

const OrganisationProjectCard: FC<IOrganisationProjectCard> = ({
  projectId,
  description,
  numTasks,
  org,
  projectName,
  profileImage,
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
        orgImage={profileImage}
        location="organisation"
        width="200px"
      />
    </div>
  );
};

OrganisationProjects.defaultProps = {
  showAddBtn: false,
};

export default OrganisationProjects;
