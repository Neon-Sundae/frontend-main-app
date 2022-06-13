/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FC, useState } from 'react';
import Education from '../Education';
import Tasks from '../Tasks';
import WorkHistory from '../WorkHistory';
import styles from './index.module.scss';

const ProfileTabs: FC = () => {
  const [activeState, setActiveState] = useState('task');

  const renderTabs = () => {
    switch (activeState) {
      case 'organisation':
        return <h1>Organisation</h1>;
      case 'project':
        return <h1>Projects</h1>;
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

  return (
    <div>
      <div className={styles['profile-tab-header']}>
        <h3
          className={clsx(
            styles['profile-tab-title'],
            activeState === 'organisation' &&
              styles['profile-tab-title--active']
          )}
          onClick={() => handleClick('organisation')}
        >
          Organisations
        </h3>
        <h3
          className={clsx(
            styles['profile-tab-title'],
            activeState === 'project' && styles['profile-tab-title--active']
          )}
          onClick={() => setActiveState('project')}
        >
          Projects
        </h3>
        <h3
          className={clsx(
            styles['profile-tab-title'],
            activeState === 'task' && styles['profile-tab-title--active']
          )}
          onClick={() => setActiveState('task')}
        >
          Tasks
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
      <div>{renderTabs()}</div>
    </div>
  );
};

export default ProfileTabs;
