/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import Education from 'components/Education';
import Tasks from 'components/Tasks';
import WorkHistory from 'components/WorkHistory';
import OrganisationTab from 'components/OrganisationTab';
import ProjectsTab from 'components/ProjectsTab';
import useIsOrganisationMember from 'hooks/useIsOrganisationMember';
import { useFetchUserDetailsWrapper } from 'queries/user';
import { useFetchProfileDetailsWrapper } from 'queries/profile';
import styles from './index.module.scss';

const ProfileTabs: FC = () => {
  const params = useParams();
  const [activeState, setActiveState] = useState('workHistory');
  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsWrapper(params.profileId);

  const { isOrganisationMember } = useIsOrganisationMember(
    userData?.user?.userId
  );

  // * This condition's working to differentiate between the logged in user and the profile user
  const isLoggedInUser = userData?.user.userId === profileData?.userId;

  useEffect(() => {
    setActiveState('workHistory');
  }, [params.profileId]);

  const renderTabs = () => {
    switch (activeState) {
      case 'organisation':
        return <OrganisationTab />;
      case 'project':
        return <ProjectsTab />;
      case 'task':
        return <Tasks />;
      case 'workHistory':
        return <WorkHistory />;
      case 'education':
        return <Education />;
      default:
        return null;
    }
  };

  const handleClick = (value: string) => {
    setActiveState(value);
  };

  if (isOrganisationMember === undefined) {
    return null;
  }

  return (
    <>
      <div className={styles['profile-tab-header']}>
        {isOrganisationMember && isLoggedInUser && (
          <h3
            className={clsx(
              styles['profile-tab-title'],
              activeState === 'organisation' &&
                styles['profile-tab-title--active']
            )}
            onClick={() => handleClick('organisation')}
          >
            My Organisations
          </h3>
        )}
        {isOrganisationMember && isLoggedInUser && (
          <h3
            className={clsx(
              styles['profile-tab-title'],
              activeState === 'project' && styles['profile-tab-title--active']
            )}
            onClick={() => setActiveState('project')}
          >
            My Projects
          </h3>
        )}
        <h3
          className={clsx(
            styles['profile-tab-title'],
            activeState === 'task' && styles['profile-tab-title--active']
          )}
          onClick={() => setActiveState('task')}
        >
          Completed Tasks
        </h3>
        <h3
          className={clsx(
            styles['profile-tab-title'],
            activeState === 'workHistory' && styles['profile-tab-title--active']
          )}
          onClick={() => setActiveState('workHistory')}
        >
          Work History
        </h3>
        <h3
          className={clsx(
            styles['profile-tab-title'],
            activeState === 'education' && styles['profile-tab-title--active']
          )}
          onClick={() => setActiveState('education')}
        >
          Education
        </h3>
      </div>
      {renderTabs()}
    </>
  );
};

export default ProfileTabs;
