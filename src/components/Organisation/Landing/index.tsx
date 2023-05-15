import NavBar from 'components/NavBar';
import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import CreateUsingProjectTemplate from 'components/StartPrjModal/CreateUsingProjectTemplate';
import JobsLanding from 'components/Jobs/Landing';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import isOrganisationMember from 'utils/accessFns/isOrganisationMember';
import BlurBlobs from 'components/BlurBlobs';
import OrganisationPublicView from 'components/OrganisationPublicView';

import {
  useFetchOrganisationDetail,
  useFetchOrganisationOwner,
  useFetchOrganisationOwnerManager,
  useFetchUserOrganisations,
} from 'queries/organisation';
import { useFetchUserDetailsWrapper } from 'queries/user';
import BasicDetails from '../BasicDetails';
import OrganisationProjects from '../OrganisationProjects';
import OrganisationJobs from '../OrganisationJobs';
import OrganisationSidebar from '../OrganisationSidebar';
import OrganisationTeam from '../OrganisationTeam';
import Banner from '../Banner';
import styles from './index.module.scss';

const Landing: FC = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabSelected, setTabSelected] = useState(searchParams.get('show'));

  const userData = useFetchUserDetailsWrapper();
  const { data: organisationDetail, isLoading } = useFetchOrganisationDetail(
    params.orgId
  );
  const { data: userOrganisations, isLoading: isLoading2 } =
    useFetchUserOrganisations(userData?.user.userId);
  const { data: owner } = useFetchOrganisationOwner(params.orgId);
  const { data: members } = useFetchOrganisationOwnerManager(params.orgId);

  const user = useSelector((state: RootState) => state.user.user);
  const publicView = useSelector((state: RootState) => state.org.publicView);

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
            <Banner organisation={organisationDetail} />
            <BasicDetails organisation={organisationDetail} owner={owner} />
            <div className={styles['organisation-project-jobs-wrap']}>
              <OrganisationProjects organisation={organisationDetail} />
              <OrganisationJobs
                organisationId={organisationDetail.organisationId}
              />
            </div>
          </>
        );
      case 'projects':
        return (
          <div className={styles['organisation-projects-wrap']}>
            <OrganisationProjects
              organisation={organisationDetail}
              showAddBtn
            />
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
              orgId={organisationDetail.organisationId}
              onNext={() => {}}
            />
          </div>
        );
      case 'teams':
        return <OrganisationTeam />;
      default:
        return (
          <>
            <Banner organisation={organisationDetail} />
            <BasicDetails organisation={organisationDetail} owner={owner} />
            <div className={styles['organisation-project-jobs-wrap']}>
              <OrganisationProjects organisation={organisationDetail} />
              <OrganisationJobs
                organisationId={organisationDetail.organisationId}
              />
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
            allOrgData={userOrganisations}
            setOrganisationTab={setOrganisationTab}
            setOrganisation={setOrganisation}
          />
          <div className={styles['organisation-content-container']}>
            <NavBar />
            {tabSelector()}
          </div>
        </div>
      ) : (
        <OrganisationPublicView organisation={organisationDetail} />
      )}
    </>
  );
};

export default Landing;
