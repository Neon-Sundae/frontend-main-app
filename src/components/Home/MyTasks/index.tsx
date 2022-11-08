import { FC, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import getRandomString from 'utils/getRandomString';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import _ from 'lodash';
import MyTasksCard from '../MyTasksCard';
import styles from './index.module.scss';
import DashboardTabs from '../DashboardTabs';
import MyTaskDetailModal from '../TaskDetailModal';

const MyTasks: FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
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

  const getAllProfileTasks = () => {
    return _.filter(data, {
      profileTask: [{ Profile: { profileId: profile?.profileId } }],
    });
  };

  const getFilteredProfileTasksData = () => {
    if (selectedTab === 'all') getAllProfileTasks();
    const getFilteredProfileTasks = () => {
      if (selectedTab === 'in progress') {
        return _.filter(data, {
          status: selectedTab,
          profileTask: [
            {
              Profile: { profileId: profile?.profileId },
            },
          ],
        });
      }
      if (selectedTab === 'in review') {
        return _.filter(data, {
          status: selectedTab,
          profileTask: [
            {
              Profile: { profileId: profile?.profileId },
            },
          ],
        });
      }
      if (selectedTab === 'completed') {
        return _.filter(data, {
          status: selectedTab,
          profileTask: [
            {
              Profile: { profileId: profile?.profileId },
            },
          ],
        });
      }
      return _.filter(data, {
        profileTask: [
          {
            applicationStatus: selectedTab,
            Profile: { profileId: profile?.profileId },
          },
        ],
      });
    };
    setFilteredData(getFilteredProfileTasks);
    return getFilteredProfileTasks;
  };
  if (openTaskDetail) {
    return (
      <MyTaskDetailModal
        selectedTaskId={selectedTaskId}
        setOpen={setOpenTaskDetail}
        key={getRandomString(5)}
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
            getAllProfileTasks()?.map((task: any) => {
              return (
                <MyTasksCard
                  key={getRandomString(5)}
                  data={task}
                  setOpenTaskDetail={setOpenTaskDetail}
                  setSelectedTaskId={setSelectedTaskId}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
