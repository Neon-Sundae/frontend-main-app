import NavBar from 'components/NavBar';
import { FC, useEffect, useState } from 'react';
import bg from 'assets/illustrations/gradients/bg.png';
import CreateUsingProjectTemplate from 'components/StartPrjModal/CreateUsingProjectTemplate';
import JobsLanding from 'components/Jobs/Landing';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Banner from '../Banner';
import styles from './index.module.scss';
import { useFetchOrganisation, useFetchUserOrganisation } from './hooks';
import BasicDetails from '../BasicDetails';
import OrganisationProjects from '../OrganisationProjects';
import OrganisationJobs from '../OrganisationJobs';
import OrganisationSidebar from '../OrganisationSidebar';

const Landing: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedOrg, setSelectedOrg] = useState('');
  const { organisation, isLoading, refetch } = useFetchOrganisation(
    Number(selectedOrg)
  );
  const { data, isLoading: loading } = useFetchUserOrganisation();
  const [tabSelected, setTabSelected] = useState(
    searchParams.get('show') || null
  );

  useEffect(() => {
    if (!searchParams.get('show')) {
      searchParams.set('show', 'home');
      setSearchParams(searchParams);
      setTabSelected(searchParams.get('show'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrg]);

  if (isLoading || loading) return null;

  const isFounder = () => {
    return user?.userId === organisation.OrganisationUser[0].user.userId;
  };

  return (
    <div
      className={styles['organisation-container']}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'space',
        backgroundAttachment: 'fixed',
      }}
    >
      {isFounder() && (
        <OrganisationSidebar
          setTabSelected={setTabSelected}
          tabSelected={tabSelected}
          allOrgData={data}
          organisationId={organisation.organisationId}
          selectedOrg={selectedOrg}
          setSelectedOrg={setSelectedOrg}
        />
      )}

      <NavBar />
      {tabSelector(tabSelected, organisation)}
    </div>
  );
};

const tabSelector = (tabSelected: string | null, organisation: any) => {
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

export default Landing;
