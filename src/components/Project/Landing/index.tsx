import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import TaskManagement from 'components/TaskManagement';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Toaster } from 'react-hot-toast';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { RootState } from 'reducers';
import styles from './index.module.scss';
import Header from '../Header';
import Description from '../Description';
import useProject from './hooks';
import PublishProjectModal from '../Modal/PublishProjectModal';


const Landing: FC = () => {
  const queryClient = useQueryClient()

  let updatedData: any;
  const [edit, setEdit] = useState(false);
  const [selectedTimeZones, setSelectedTimeZones] = useState<any>([]);
  const [input, setInput] = useState<any>({
    name: '',
    description: '',
    timeOfCompletion: '',
    budget: '',
    preferredTimeZones: [],
    organisationId: '',
    flResources: [],
    flProjectCategory: [{ categoryName: '', percentageAllocation: '' }],
  });


  const accessToken = getAccessToken();

  const { create } = useParams();
  const { getUSDCBalance, getOnChainProject } = useProject();

  const [open, setOpen] = useState(false);

  const { user, wallet_usdc_balance } = useSelector((state: RootState) => state.user);
  const userName = useSelector((state: RootState) => state.user.user?.name);

  useEffect(() => {
    if (user?.userId && accessToken) {
      getUSDCBalance();
      getOnChainProject(Number(create));
    }
  }, [user]);


  const { isLoading, error, data, isFetching } = useQuery('projectData', () =>
    fetch(`${config.ApiBaseUrl}/fl-project/${create}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    }).then(response => response.json())
  );

  const { mutate: updateProject } = useMutation(
    async () => {
      return await fetch(`${config.ApiBaseUrl}/fl-project/${create}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
    },
    {
      onSuccess: async (res) => {
        queryClient.invalidateQueries(['projectData'])
        console.log('project updated', res);
      },
      onError: (err) => {
        console.log('err', err);
      },
    }
  );


  if (isFetching) return <p>fetching</p>
  if (isLoading) return <p>loading</p>
  if (error) return <p>error</p>

  const {
    name,
    description,
    budget,
    timeOfCompletion,
    preferredTimeZones,
    flProjectCategory,
    flResources,
  } = data;

  const setEditableFunc = () => {
    setEdit(s => !s);
  }

  const setInputFunc = (e: any) => {
    if (e.target.name === 'budget') {
      setInput({ ...input, budget: parseInt(e.target.value) });
    }
    if (e.target.name === 'timeOfCompletion') {
      const IsDate = new Date(e.target.value).toISOString();
      setInput({ ...input, timeOfCompletion: IsDate });
    }
    if (e.target.name === 'name') {
      setInput({ ...input, name: e.target.value });
    }
    if (e.target.name === 'description') {
      setInput({ ...input, description: e.target.value });
    }
  }

  const setTimeZoneFunc = (options: any) => {
    setSelectedTimeZones(options);
    setInput((prevState: any) => {
      return { ...prevState, preferredTimeZones: options };
    })
  }

  const normalizeData = (data: any) => {
    for (let key in data) {
      if (data[key] === "" || data[key] === null || data[key].length === 0) {
        delete data[key]
      }
    }
    // remove this to update preferred timezones and fl project category
    delete data.preferredTimeZones
    delete data.flProjectCategory
    updatedData = data;
  }

  console.log('updatedData', updatedData);
  console.log(input);
  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <Header
        projectName={name}
        founderName={userName || ''}
        setOpen={val => setOpen(val)}
        budget={budget}
        editable={() => setEditableFunc()}
        input={(e) => setInputFunc(e)}
        edit={edit}
        save={() => { normalizeData(input); updateProject() }}
      />
      <Description
        description={description}
        budget={budget}
        timeOfCompletion={timeOfCompletion}
        preferredTimeZones={preferredTimeZones}
        flResources={flResources}
        flProjectCategory={flProjectCategory}
        input={(e) => setInputFunc(e)}
        edit={edit}
        selectedTimeZones={(options: any) => setTimeZoneFunc(options)}
      />
      <TaskManagement />
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
};

export default Landing;
