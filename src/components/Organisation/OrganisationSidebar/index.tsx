import { ReactComponent as HomeIcon } from 'assets/illustrations/organisation/sidebar/home.svg';
import { ReactComponent as ProjectsIcon } from 'assets/illustrations/organisation/sidebar/projects.svg';
import { ReactComponent as JobsIcon } from 'assets/illustrations/organisation/sidebar/jobs.svg';
import { ReactComponent as TemplatesIcon } from 'assets/illustrations/organisation/sidebar/templates.svg';
import { ReactComponent as TeamsIcon } from 'assets/illustrations/organisation/sidebar/teams.svg';
import { ReactComponent as ExpandIcon } from 'assets/illustrations/organisation/sidebar/expand.svg';
import { ReactComponent as CollapseIcon } from 'assets/illustrations/organisation/sidebar/collapse.svg';
import bg from 'assets/illustrations/organisation/sidebar/bg.png';
import clsx from 'clsx';
import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap, Elastic } from 'gsap';
import styles from './index.module.scss';

interface OrganisationSidebarProps {
  setOrganisationTab: (value: string) => void;
  setOrganisation: (value: string) => void;
  tabSelected: string | null;
  allOrgData: any[];
}

const OrganisationSidebar: FC<OrganisationSidebarProps> = ({
  setOrganisationTab,
  setOrganisation,
  tabSelected,
  allOrgData,
}) => {
  const { orgId } = useParams();
  const [expandSidebar, setExpandSidebar] = useState(true);
  const [isExpanded, setExpanded] = useState(false);
  const [currentOrg, setCurrentOrg] = useState(
    allOrgData?.find(x => x.organisationId === orgId)
  );

  const sideBarRef = useRef(null);

  useEffect(() => {
    if (expandSidebar) {
      gsap.to(sideBarRef.current, {
        width: 200,
        duration: 0.5,
        ease: Elastic.easeOut.config(1, 0.6),
      });
    } else {
      gsap.to(sideBarRef.current, {
        width: 125,
        duration: 0.5,
        ease: Elastic.easeOut.config(1, 0.6),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandSidebar]);

  useEffect(() => {
    if (orgId) {
      setCurrentOrg(allOrgData?.find(x => x.organisationId === Number(orgId)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const setTab = (e: MouseEvent<HTMLAnchorElement>) => {
    setOrganisationTab(e.currentTarget.id);
  };

  const setOrgId = (e: MouseEvent<HTMLAnchorElement>) => {
    setOrganisation(e.currentTarget.id);
    setExpanded(false);
    setExpandSidebar(false);
  };

  return (
    <div
      ref={sideBarRef}
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

                <div>
                  <h4>{currentOrg?.name}</h4>
                </div>
              </div>
              <div className={styles['expanded-list--items']}>
                {allOrgData.map(org => (
                  <Link
                    to={`/organisation/${org?.organisationId}?show=home`}
                    key={org?.organisationId}
                    id={org?.organisationId}
                    onClick={setOrgId}
                  >
                    {org?.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div
        className={styles[`organisation-sidebar--navigation-icons-container`]}
      >
        <div className={styles[`organisation-sidebar-icons`]}>
          <Link
            id="home"
            to={`/organisation/${currentOrg?.organisationId}?show=home`}
            className={clsx(
              tabSelected === 'home' && styles.active,
              styles.button
            )}
            onClick={setTab}
          >
            <HomeIcon width={24} height={24} />
            {expandSidebar && <p>Home</p>}
          </Link>
          <Link
            id="projects"
            to={`/organisation/${currentOrg?.organisationId}?show=projects`}
            onClick={setTab}
            title="Projects"
            className={clsx(
              tabSelected === 'projects' && styles.active,
              styles.button
            )}
          >
            <ProjectsIcon width={24} height={24} />
            {expandSidebar && <p>Projects</p>}
          </Link>
          <Link
            id="jobs"
            to={`/organisation/${currentOrg?.organisationId}?show=jobs`}
            onClick={setTab}
            title="Jobs"
            className={clsx(
              tabSelected === 'jobs' && styles.active,
              styles.button
            )}
          >
            <JobsIcon width={24} height={24} />
            {expandSidebar && <p>Jobs</p>}
          </Link>
          <Link
            id="teams"
            to={`/organisation/${currentOrg?.organisationId}?show=teams`}
            onClick={setTab}
            title="Teams"
            className={clsx(
              tabSelected === 'teams' && styles.active,
              styles.button
            )}
          >
            <TeamsIcon width={24} height={24} />
            {expandSidebar && <p>Teams</p>}
          </Link>
          {/* TODO: this feature not implemented yet */}
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
