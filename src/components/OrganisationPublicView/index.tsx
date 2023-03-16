import Banner from 'components/Organisation/Banner';
import NavBar from 'components/NavBar';
import { IOrganisation } from 'interfaces/organisation';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
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

  const renderTab = () => {
    switch (org.selectedTab) {
      case 0:
        return <OverviewTab />;
      case 1:
        return <ProjectsTab />;
      case 2:
        return <PeopleTab />;
      case 3:
        return <JobsTab />;
      default:
        return null;
    }
  };

  return (
    <div className={styles[`organisation-public-view`]}>
      <NavBar />
      <Banner organisation={organisation} />
      <HorizontalTabs />
      {renderTab()}
    </div>
  );
};

export default OrganisationPublicView;
