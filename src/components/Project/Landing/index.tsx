import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NavBar from 'components/NavBar';
import bg from 'assets/illustrations/gradients/bg.png';
import TaskManagement from 'components/TaskManagement';
import { useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getAccessToken } from 'utils/authFn';
import { RootState } from 'reducers';

import Header from '../Header';
import Description from '../Description';
import { useProject, useFetchProjects } from './hooks';
import PublishProjectModal from '../Modal/PublishProjectModal';
import styles from './index.module.scss';

const Landing: FC = () => {
  const accessToken = getAccessToken();

  const { create } = useParams();
  const { getUSDCBalance, fetchFounder } = useProject();
  const { projectData = {} } = useFetchProjects(create);
  const [open, setOpen] = useState(false);

  const { user, wallet_usdc_balance } = useSelector(
    (state: RootState) => state.user
  );
  const { selectedProjectAddress } = useSelector(
    (state: RootState) => state.flProject
  );

  useEffect(() => {
    if (user?.userId && accessToken) {
      getUSDCBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (selectedProjectAddress) {
      fetchFounder(selectedProjectAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectAddress]);

  const {
    name = '',
    description,
    budget,
    timeOfCompletion,
    preferredTimeZones,
    flResources,
    organisation,
    organisationId,
  } = projectData;

  return projectData ? (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'space',
        backgroundAttachment: 'fixed',
      }}
    >
      <NavBar />
      <Header
        projectName={name}
        setOpen={val => setOpen(val)}
        organisationName={organisation?.name}
        organisationId={organisationId}
      />
      <Description
        description={description}
        budget={budget}
        timeOfCompletion={timeOfCompletion}
        preferredTimeZones={preferredTimeZones}
        flResources={flResources}
      />
      <TaskManagement
        project_budget={budget}
        project_name={name}
        project_founder={organisation?.OrganisationUser[0]?.walletId}
        flProjectCategory={projectData.flProjectCategory}
      />
      {open && (
        <PublishProjectModal
          setOpen={(val: any) => setOpen(val)}
          usdcBalance={wallet_usdc_balance}
          projectId={String(create)}
          budget={budget}
        />
      )}
      <Toaster />
    </div>
  ) : (
    <div className={styles.container} />
  );
};

export default Landing;
