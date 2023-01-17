import NavBar from 'components/NavBar';
import { FC, useEffect, useState } from 'react';
import bg from 'assets/illustrations/gradients/bg.png';
import CreateUsingProjectTemplate from 'components/StartPrjModal/CreateUsingProjectTemplate';
import JobsLanding from 'components/Jobs/Landing';
import Banner from '../Banner';
import styles from './index.module.scss';
import { useFetchOrganisation, useFetchUserOrganisation } from './hooks';
import BasicDetails from '../BasicDetails';
import OrganisationProjects from '../OrganisationProjects';
import OrganisationJobs from '../OrganisationJobs';
import OrganisationSidebar from '../OrganisationSidebar';

const Landing: FC = () => {
  const [selectedOrg, setSelectedOrg] = useState('');
  const { organisation, isLoading, refetch } =
    useFetchOrganisation(selectedOrg);
  const { data, isLoading: loading } = useFetchUserOrganisation();
  const [tabSelected, setTabSelected] = useState('home');

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrg]);

  if (isLoading || loading) return null;

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
      <OrganisationSidebar
        setTabSelected={setTabSelected}
        tabSelected={tabSelected}
        allOrgData={data}
        organisationId={organisation.organisationId}
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
      />
      <NavBar />
      {tabSelected === 'home' && (
        <>
          <Banner organisation={organisation} />
          <BasicDetails organisation={organisation} />
          <div className={styles['organisation-project-jobs-wrap']}>
            <OrganisationProjects organisation={organisation} />
            <OrganisationJobs organisationId={organisation.organisationId} />
          </div>
        </>
      )}
      {tabSelected === 'projects' && (
        <div className={styles['organisation-projects-wrap']}>
          <OrganisationProjects organisation={organisation} showAddBtn />
        </div>
      )}
      {tabSelected === 'jobs' && (
        <div className={styles['organisation-jobs-wrap']}>
          <JobsLanding hideNavbar />
        </div>
      )}
      {tabSelected === 'templates' && (
        <div className={styles['organisation-templates-wrap']}>
          <CreateUsingProjectTemplate
            onClose={() => {}}
            orgId={organisation.organisationId}
            onNext={() => {}}
            showModal={false}
          />
        </div>
      )}
    </div>
  );
};

export default Landing;
