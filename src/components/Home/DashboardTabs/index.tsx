import clsx from 'clsx';
import { FC } from 'react';
import styles from './index.module.scss';

interface IDashboardTabs {
  selectedTab: string;
  setSelectedTab: any;
}

const DashboardTabs: FC<IDashboardTabs> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className={styles['dashboard-tabs-wrap']}>
      <TabButton
        tabName="all"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <TabButton
        tabName="applied"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <TabButton
        tabName="accepted"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <TabButton
        tabName="in progress"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <TabButton
        tabName="in review"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <TabButton
        tabName="completed"
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </div>
  );
};

interface ITabButton {
  tabName: string;
  selectedTab: string;
  setSelectedTab: any;
}

const TabButton: FC<ITabButton> = ({
  tabName,
  selectedTab,
  setSelectedTab,
}) => {
  const handleClick = () => {
    setSelectedTab(tabName);
  };
  const handleFocusOut = () => {
    setSelectedTab('all');
  };
  return (
    <button
      onClick={() => handleClick()}
      className={clsx(
        styles['tab-btn'],
        tabName === selectedTab && styles['selected-btn']
      )}
      onAbort={() => handleFocusOut()}
    >
      {tabName}
    </button>
  );
};

export default DashboardTabs;
