import Banner from 'components/Organisation/Banner';
import NavBar from 'components/NavBar';
import { IOrganisation } from 'interfaces/organisation';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import useFetchOrganisationOwnerManager from 'hooks/useFetchOrganisationOwnerManager';
import styles from './index.module.scss';
import HorizontalTabs from './HorizontalTabs';
import OverviewTab from './OverviewTab';
import ProjectsTab from './ProjectsTab';
import PeopleTab from './PeopleTab';
import JobsTab from './JobsTab';

interface IOrganisationPublicView {
  organisation: IOrganisation;
}

const OrganisationPublicView: FC<IOrganisationPublicView> = ({
  organisation,
}) => {
  const org = useSelector((state: RootState) => state.org);
  const { members } = useFetchOrganisationOwnerManager(
    organisation.organisationId.toString()
  );
  const {
    description,
    whitepaper,
    flProjects,
    customButtonLabel,
    customButtonLink,
  } = organisation;

  const renderTab = () => {
    switch (org.selectedTab) {
      case 0:
        return (
          <OverviewTab description={description} whitepaper={whitepaper} />
        );
      case 1:
        return <ProjectsTab flProjects={flProjects} />;
      case 2:
        return <PeopleTab members={members} />;
      case 3:
        return <JobsTab />;
      default:
        return (
          <OverviewTab description={description} whitepaper={whitepaper} />
        );
    }
  };

  return (
    <div className={styles[`organisation-public-view`]}>
      <NavBar />
      <Banner organisation={organisation} />
      <HorizontalTabs
        customButtonLabel={customButtonLabel || 'custom button'}
        customButtonLink={customButtonLink || 'link'}
      />
      {renderTab()}
    </div>
  );
};

export default OrganisationPublicView;
