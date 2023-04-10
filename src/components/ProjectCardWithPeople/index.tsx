import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import { OrganisationProjects } from 'interfaces/organisation';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import getRandomString from 'utils/getRandomString';
import styles from './index.module.scss';

interface IProjectCardWithPeople {
  flProjects: OrganisationProjects[];
}

const ProjectCardWithPeople: FC<IProjectCardWithPeople> = ({ flProjects }) => {
  const navigate = useNavigate();

  return (
    <div className={styles[`project-card-with-people`]}>
      {flProjects.map((flProject: OrganisationProjects) => (
        <div
          className={styles[`project-card-with-people--card`]}
          onClick={() => navigate(`/project/${flProject.flProject_uuid}`)}
          key={getRandomString(5)}
        >
          <BrandImage
            width={54.07}
            height={56.42}
            style={{
              borderRadius: '50%',
            }}
          />
          <h3>{flProject.flProjectName}</h3>
          <p>{flProject.flProjectDescription}</p>
          <ProjectPeople projectPeople={flProject.projectPeople} />
          <span>
            <p>
              {flProject.taskCount}
              &nbsp;{flProject.taskCount <= 1 ? 'task' : 'tasks'}
            </p>
            <i className={clsx('material-icons', styles['arrow-right-alt'])}>
              arrow_right_alt
            </i>
          </span>
        </div>
      ))}
    </div>
  );
};

interface IProjectPeople {
  projectPeople: { profileId: number; picture: string | undefined }[];
}

const ProjectPeople: FC<IProjectPeople> = ({ projectPeople }) => {
  return (
    <div className={styles[`project-people-avatars`]}>
      {projectPeople.map(
        (projectPerson: { profileId: number; picture: string | undefined }) => (
          <img src={projectPerson.picture ?? 'null'} alt="" />
        )
      )}
      {projectPeople.length >= 3 && <p> +{projectPeople.length - 2}</p>}
    </div>
  );
};

export default ProjectCardWithPeople;
