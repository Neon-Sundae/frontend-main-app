import NavBar from 'components/NavBar';
import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import CreateUsingProjectTemplate from 'components/StartPrjModal/CreateUsingProjectTemplate';
import JobsLanding from 'components/Jobs/Landing';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import useFetchOrganisationOwner from 'hooks/useFetchOrganisationOwner';
import useFetchOrganisationOwnerManager from 'hooks/useFetchOrganisationOwnerManager';
import isOrganisationMember from 'utils/accessFns/isOrganisationMember';
import BlurBlobs from 'components/BlurBlobs';
import OrganisationPublicView from 'components/OrganisationPublicView';
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
  const { data, isLoading: isLoading2 } = useFetchUserOrganisation();
  const { owner } = useFetchOrganisationOwner(orgId);
  const { members } = useFetchOrganisationOwnerManager(orgId);
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

  if (isLoading || isLoading2) return null;

  const setOrganisationTab = (value: string) => {
    setTabSelected(value);
    searchParams.set('show', value);
    setSearchParams(searchParams);
  };

  const setOrganisation = () => {
    setTabSelected('home');
  };

  const tabSelector = () => {
    switch (tabSelected) {
      case 'home':
        return (
          <>
            <Banner organisation={organisation} />
            <BasicDetails organisation={organisation} owner={owner} />
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
            <BasicDetails organisation={organisation} owner={owner} />
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
      <BlurBlobs />
      {isOrganisationMember(user, members) ? (
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
        <OrganisationPublicView organisation={organisation} />
      )}
    </>
  );
};

export default Landing;
