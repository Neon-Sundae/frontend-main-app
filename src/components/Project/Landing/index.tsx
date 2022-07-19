/* eslint-disable camelcase */
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
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
  const { getUSDCBalance, getOnChainProject, fetchFounder } = useProject();

  const [open, setOpen] = useState(false);

  const { user, wallet_usdc_balance } = useSelector(
    (state: RootState) => state.user
  );
  const userName = useSelector((state: RootState) => state.user.user?.name);
  const { selectedProjectAddress } = useSelector(
    (state: RootState) => state.flProject
  );

  useEffect(() => {
    if (user?.userId && accessToken) {
      getUSDCBalance();
      getOnChainProject(Number(create));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (selectedProjectAddress) {
      fetchFounder(selectedProjectAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectAddress]);

  const { projectData } = useFetchProjects(create);

  if (projectData) {
    const {
      name,
      description,
      budget,
      timeOfCompletion,
      preferredTimeZones,
      flResources,
      organisation,
    } = projectData;

    return (
      <div className={styles.container}>
        <BlurBlobs />
        <NavBar />
        <Header
          projectName={name}
          founderName={userName || ''}
          setOpen={val => setOpen(val)}
          budget={budget}
          founderAddress={organisation?.organisationUser[0]?.walletId}
        />
        <Description
          description={description}
          budget={budget}
          timeOfCompletion={timeOfCompletion}
          preferredTimeZones={preferredTimeZones}
          flResources={flResources}
        />
        <TaskManagement project_budget={budget} project_name={name} />
        {open && (
          <PublishProjectModal
            setOpen={(val: any) => setOpen(val)}
            usdcBalance={wallet_usdc_balance}
            projectId={Number(create)}
            budget={budget}
            projectName={name}
            projectDescription={description}
          />
        )}
        <Toaster />
      </div>
    );
  }

  return <div className={styles.container} />;
};

export default Landing;
