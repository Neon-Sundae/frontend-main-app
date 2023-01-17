import { ReactComponent as HomeIcon } from 'assets/illustrations/organisation/sidebar/home.svg';
import { ReactComponent as ProjectsIcon } from 'assets/illustrations/organisation/sidebar/projects.svg';
import { ReactComponent as JobsIcon } from 'assets/illustrations/organisation/sidebar/jobs.svg';
import { ReactComponent as TemplatesIcon } from 'assets/illustrations/organisation/sidebar/templates.svg';
import { ReactComponent as ExpandIcon } from 'assets/illustrations/organisation/sidebar/expand.svg';
import { ReactComponent as CollapseIcon } from 'assets/illustrations/organisation/sidebar/collapse.svg';
import bg from 'assets/illustrations/organisation/sidebar/bg.png';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { IOrganisation } from 'interfaces/organisation';
import styles from './index.module.scss';
import {
  useFetchOrganisation,
  useFetchUserOrganisation,
} from '../Landing/hooks';

interface OrganisationSidebarProps {
  setTabSelected: (arg0: string) => void;
  tabSelected: string;
  allOrgData: any[];
  organisationId: number;
  setSelectedOrg: any;
  selectedOrg: any;
}

const OrganisationSidebar: FC<OrganisationSidebarProps> = ({
  setTabSelected,
  tabSelected,
  allOrgData,
  organisationId,
  setSelectedOrg,
  selectedOrg,
}) => {
  const [expandSidebar, setExpandSidebar] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  const currentOrg = allOrgData?.find(x => x.organisationId === organisationId);

  console.log(selectedOrg);
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
        <>
          <button
            onClick={() => setExpandSidebar(false)}
            className={styles[`collapse-btn`]}
          >
            <CollapseIcon width={25.7} height={25.7} />
          </button>

          {!isExpanded ? (
            <div
              onClick={() => setExpanded(true)}
              className={styles['non-expanded-list']}
            >
              <i className="material-icons">expand_more</i>
              <div>
                <h4>{currentOrg?.name}</h4>
              </div>
            </div>
          ) : (
            <div className={styles['expanded-list']}>
              <div onClick={() => setExpanded(false)}>
                <i className="material-icons">expand_more</i>
                {true ? (
                  <div>
                    <h4>{currentOrg?.name}</h4>
                  </div>
                ) : (
                  <div className={styles['project-list-select']}>
                    <h4>Select Organisation</h4>
                  </div>
                )}
              </div>
              {1 > 0 ? (
                allOrgData.map(org => (
                  <span
                    key={org?.organisationId}
                    onClick={() => {
                      setSelectedOrg(org?.organisationId);
                    }}
                  >
                    {org?.name}
                  </span>
                ))
              ) : (
                <p>No projects</p>
              )}
            </div>
          )}
        </>
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
          {/* <button
            onClick={() => setTabSelected('templates')}
            title="Templates"
            className={clsx(tabSelected === 'templates' && styles.active)}
          >
            <TemplatesIcon width={24} height={24} />
            {expandSidebar && <p>Templates</p>}
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default OrganisationSidebar;
