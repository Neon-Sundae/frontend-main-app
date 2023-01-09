import NavBar from 'components/NavBar';
import { FC, useState } from 'react';
import bg from 'assets/illustrations/gradients/bg.png';
import CreateUsingProjectTemplate from 'components/StartPrjModal/CreateUsingProjectTemplate';
import AllJobsLanding from 'components/Jobs/AllJobs';
import Banner from '../Banner';
import styles from './index.module.scss';
import useFetchOrganisation from './hooks';
import BasicDetails from '../BasicDetails';
import OrganisationProjects from '../OrganisationProjects';
import OrganisationJobs from '../OrganisationJobs';
import OrganisationSidebar from '../OrganisationSidebar';

const Landing: FC = () => {
  const { organisation, isLoading } = useFetchOrganisation();
  const [tabSelected, setTabSelected] = useState('home');
  if (isLoading) return null;
  console.log('tabSelected', tabSelected);
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
          <OrganisationProjects organisation={organisation} />
        </div>
      )}
      {tabSelected === 'jobs' && (
        <div className={styles['organisation-jobs-wrap']}>
          <AllJobsLanding hideNavbar />
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
