import { useQuery } from '@tanstack/react-query';
import Card from 'components/Card';
import config from 'config';
import _ from 'lodash';
import { getAccessToken } from 'utils/authFn';
import getRandomString from 'utils/getRandomString';
import { useFetchUserDetailsWrapper } from 'queries/user';
import { useFetchProfileDetailsByUserWrapper } from 'queries/profile';
import ProjectCard from '../ProjectCard';
import styles from './index.module.scss';

const MyProjects = () => {
  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsByUserWrapper({
    userId: userData?.user?.userId,
  });

  const { data } = useQuery(
    ['myFlProjects'],
    () =>
      fetch(`${config.ApiBaseUrl}/task/all`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then(response => response.json()),
    {
      refetchOnWindowFocus: false,
    }
  );

  const getFilteredProfileTasksData = () => {
    return _.filter(data, {
      profileTask: [{ Profile: { profileId: profileData?.profileId } }],
    });
  };

  const filteredProjects = getFilteredProfileTasksData();
  const res = [
    ...new Map(
      filteredProjects?.map((o: any) => [
        JSON.stringify(o.flProjectCategory.flProject),
        o,
      ])
    ).values(),
  ];

  return (
    <>
      <h2>Projects I have applied to</h2>
      <div className={styles['my-projects-container']}>
        <Card showTransparentBg location="my-projects">
          {res?.map((project: any) => (
            <ProjectCard
              key={getRandomString(5)}
              projectId={project.flProjectCategory.flProject.flProjectId_uuid}
              projectName={project.flProjectCategory.flProject.name}
              org={project.flProjectCategory.flProject.organisationName}
              description={project.flProjectCategory.flProject.description}
              // eslint-disable-next-line no-underscore-dangle
              numTasks={project.flProjectCategory._count.tasks}
              orgImage={
                project.flProjectCategory.flProject.organisation.profileImage
              }
              width=""
            />
          ))}
        </Card>
      </div>
    </>
  );
};
export default MyProjects;
