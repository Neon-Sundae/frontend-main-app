import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import TaskManagement from 'components/TaskManagement';
import { useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getAccessToken } from 'utils/authFn';
import { RootState } from 'reducers';
import Header from '../Header';
import Description from '../Description';
import useProject from './hooks';
import PublishProjectModal from '../Modal/PublishProjectModal';

const Landing: FC = () => {
  const accessToken = getAccessToken();

  const { create } = useParams();

  const { getUSDCBalance, getOnChainProject, useFetchProjects } = useProject();



  const [open, setOpen] = useState(false);

  const { user, wallet_usdc_balance } = useSelector((state: RootState) => state.user);
  const userName = useSelector((state: RootState) => state.user.user?.name);
  const { selectedProjectAddress } = useSelector((state: RootState) => state.flProject);

  useEffect(() => {
    if (user?.userId && accessToken) {
      getUSDCBalance();
      getOnChainProject(Number(create));
    }
  }, [user]);


  const { projectData } = useFetchProjects(create);

  useEffect(() => {
    if (selectedProjectAddress) {
      fetchFounder(selectedProjectAddress);
    }
  }, [selectedProjectAddress]);

  const { isLoading, error, data, isFetching } = useQuery('userOrgs', () =>
    fetch(`${config.ApiBaseUrl}/fl-project/${create}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    }).then(response => response.json())
  );
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error :|</p>;


  const {
    name,
    description,
    budget,
    timeOfCompletion,
    preferredTimeZones,
    flResources,

  } = projectData;




  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <Header
        projectName={name}
        founderName={userName || ''}
        setOpen={(val) => setOpen(val)}
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
      {
        open && <PublishProjectModal
          setOpen={(val: any) => setOpen(val)}
          usdcBalance={wallet_usdc_balance}
          projectId={Number(create)}
          budget={budget}
          projectName={name}
          projectDescription={description}
        />
      }
      <Toaster />
    </div>
  );
};

export default Landing;
