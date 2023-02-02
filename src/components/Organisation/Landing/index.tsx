import NavBar from 'components/NavBar';
import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import bg from 'assets/illustrations/gradients/bg.png';
import CreateUsingProjectTemplate from 'components/StartPrjModal/CreateUsingProjectTemplate';
import JobsLanding from 'components/Jobs/Landing';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import Banner from '../Banner';
import styles from './index.module.scss';
import { useFetchOrganisation, useFetchUserOrganisation } from './hooks';
import BasicDetails from '../BasicDetails';
import OrganisationProjects from '../OrganisationProjects';
import OrganisationJobs from '../OrganisationJobs';
import OrganisationSidebar from '../OrganisationSidebar';
import OrganisationTeam from '../OrganisationTeam';

const Landing: FC = () => {
  const { orgId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { organisation, isLoading } = useFetchOrganisation(orgId);
  const { data, isLoading: loading } = useFetchUserOrganisation();
  const [tabSelected, setTabSelected] = useState(searchParams.get('show'));

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!searchParams.get('show')) {
      searchParams.set('show', 'home');
      setSearchParams(searchParams);
      setTabSelected('home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || loading) return null;

  const setOrganisationTab = (value: string) => {
    setTabSelected(value);
    searchParams.set('show', value);
    setSearchParams(searchParams);
  };

  const setOrganisation = () => {
    setTabSelected('home');
  };

  const isFounder = () => {
    return user?.userId === organisation.OrganisationUser[0].user.userId;
  };

  const tabSelector = () => {
    switch (tabSelected) {
      case 'home':
        return (
          <>
            <Banner organisation={organisation} />
            <BasicDetails organisation={organisation} />
            <div className={styles['organisation-project-jobs-wrap']}>
              <OrganisationProjects organisation={organisation} />
              <OrganisationJobs organisationId={organisation.organisationId} />
            </div>
          </>
        );
      case 'projects':
        return (
          <div className={styles['organisation-projects-wrap']}>
            <OrganisationProjects organisation={organisation} showAddBtn />
          </div>
        );
      case 'jobs':
        return (
          <div className={styles['organisation-jobs-wrap']}>
            <JobsLanding hideNavbar />
          </div>
        );
      case 'templates':
        return (
          <div className={styles['organisation-templates-wrap']}>
            <CreateUsingProjectTemplate
              onClose={() => {}}
              orgId={organisation.organisationId}
              onNext={() => {}}
            />
          </div>
        );
      case 'teams':
        return <OrganisationTeam />;
      default:
        return (
          <>
            <Banner organisation={organisation} />
            <BasicDetails organisation={organisation} />
            <div className={styles['organisation-project-jobs-wrap']}>
              <OrganisationProjects organisation={organisation} />
              <OrganisationJobs organisationId={organisation.organisationId} />
            </div>
          </>
        );
    }
  };

  return (
    <>
      {isFounder() ? (
        <div
          className={clsx(
            styles['organisation-container'],
            styles['organisation-container--founder']
          )}
        >
          <OrganisationSidebar
            tabSelected={tabSelected}
            allOrgData={data}
            setOrganisationTab={setOrganisationTab}
            setOrganisation={setOrganisation}
          />
          <div className={styles['organisation-content-container']}>
            <NavBar />
            {tabSelector()}
          </div>
        </div>
      ) : (
        <div className={styles['organisation-container']}>
          <NavBar />
          {tabSelector()}
        </div>
      )}
    </>
  );
};

export default Landing;
