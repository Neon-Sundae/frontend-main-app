import { FC, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import getRandomString from 'utils/getRandomString';
import MyTasksCard from '../MyTasksCard';
import styles from './index.module.scss';
import DashboardTabs from '../DashboardTabs';
import MyTaskDetailModal from '../TaskDetailModal';

const MyTasks: FC = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState(0);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);

  useEffect(() => {
    getFilteredProfileTasksData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  const { data } = useQuery(
    ['myTasks'],
    () =>
      fetch(`${config.ApiBaseUrl}/task/all`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then(response => response.json()),
    {
      refetchOnWindowFocus: false,
    }
  );
  const [filteredData, setFilteredData] = useState(data);

  const getAllProfileTasks = () =>
    data?.filter((task: any) =>
      Object.keys(task).some(() => task.profileTask?.length > 0)
    );

  const getFilteredProfileTasksData = () => {
    if (selectedTab === 'all') getAllProfileTasks();
    const getFilteredProfileTasks = data?.filter((d: any) => {
      if (d && d.profileTask && d.profileTask.length > 0)
        return d.profileTask?.every((c: any) => {
          return c.applicationStatus === selectedTab;
        });
      return null;
    });
    setFilteredData(getFilteredProfileTasks);
    return getFilteredProfileTasks;
  };
  if (openTaskDetail) {
    return (
      <MyTaskDetailModal
        selectedTaskId={selectedTaskId}
        setOpen={setOpenTaskDetail}
      />
    );
  }
  return (
    <div className={styles['my-tasks-container']}>
      <h3>My Tasks</h3>
      <div className={styles.glass}>
        <div className={styles['my-tasks-']}>
          <DashboardTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>
        <div className={styles['my-task-cards-wrapper']}>
          {filteredData &&
            filteredData.length > 0 &&
            filteredData.map((task: any) => (
              <MyTasksCard
                key={getRandomString(5)}
                data={task}
                setOpenTaskDetail={setOpenTaskDetail}
                setSelectedTaskId={setSelectedTaskId}
              />
            ))}
          {selectedTab === 'all' &&
            getAllProfileTasks()?.map((task: any) => (
              <MyTasksCard
                key={getRandomString(5)}
                data={task}
                setOpenTaskDetail={setOpenTaskDetail}
                setSelectedTaskId={setSelectedTaskId}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
