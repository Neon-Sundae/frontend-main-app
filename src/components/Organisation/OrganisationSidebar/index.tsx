import { ReactComponent as HomeIcon } from 'assets/illustrations/organisation/sidebar/home.svg';
import { ReactComponent as ProjectsIcon } from 'assets/illustrations/organisation/sidebar/projects.svg';
import { ReactComponent as JobsIcon } from 'assets/illustrations/organisation/sidebar/jobs.svg';
import { ReactComponent as TemplatesIcon } from 'assets/illustrations/organisation/sidebar/templates.svg';
import { ReactComponent as ExpandIcon } from 'assets/illustrations/organisation/sidebar/expand.svg';
import { ReactComponent as CollapseIcon } from 'assets/illustrations/organisation/sidebar/collapse.svg';
import bg from 'assets/illustrations/organisation/sidebar/bg.png';
import clsx from 'clsx';
import { FC, useState } from 'react';
import styles from './index.module.scss';

interface OrganisationSidebarProps {
  setTabSelected: (arg0: string) => void;
  tabSelected: string;
}

const OrganisationSidebar: FC<OrganisationSidebarProps> = ({
  setTabSelected,
  tabSelected,
}) => {
  const [expandSidebar, setExpandSidebar] = useState(false);
  const activeClass = clsx;

  return (
    <div
      className={clsx(
        styles['organisation-sidebar'],
        expandSidebar && styles['organisation-sidebar--expanded']
      )}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'space',
      }}
    >
      {!expandSidebar && (
        <button
          onClick={() => setExpandSidebar(true)}
          className={styles[`expand-btn`]}
        >
          <ExpandIcon width={49.7} height={49.7} />
        </button>
      )}
      {expandSidebar && (
        <button
          onClick={() => setExpandSidebar(false)}
          className={styles[`collapse-btn`]}
        >
          <CollapseIcon width={25.7} height={25.7} />
        </button>
      )}
      <div
        className={styles[`organisation-sidebar--navigation-icons-container`]}
      >
        <div className={styles[`organisation-sidebar-icons`]}>
          <button
            onClick={() => setTabSelected('home')}
            title="Home"
            className={clsx(tabSelected === 'home' && styles.active)}
          >
            <HomeIcon width={24} height={24} />
            {expandSidebar && <p>Home</p>}
          </button>
          <button
            onClick={() => setTabSelected('projects')}
            title="Projects"
            className={clsx(tabSelected === 'projects' && styles.active)}
          >
            <ProjectsIcon width={24} height={24} />
            {expandSidebar && <p>Projects</p>}
          </button>
          <button
            onClick={() => setTabSelected('jobs')}
            title="Jobs"
            className={clsx(tabSelected === 'jobs' && styles.active)}
          >
            <JobsIcon width={24} height={24} />
            {expandSidebar && <p>Jobs</p>}
          </button>
          {/* TODO: this feature not implemented yet */}
          {/* <button
            onClick={() => setTabSelected('teams')}
            title="Teams"
            className={clsx(tabSelected === 'teams' ? 'active-tab' : 'inactive-tab')}
          >
            <TeamsIcon width={24} height={24} />
            {expandSidebar && <p>Teams</p>}
          </button> */}
          <button
            onClick={() => setTabSelected('templates')}
            title="Templates"
            className={clsx(tabSelected === 'templates' && styles.active)}
          >
            <TemplatesIcon width={24} height={24} />
            {expandSidebar && <p>Templates</p>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganisationSidebar;
