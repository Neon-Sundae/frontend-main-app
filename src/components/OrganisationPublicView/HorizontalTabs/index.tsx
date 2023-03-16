import { selectedOrganisationPageTab } from 'actions/organisation';
import { useDispatch } from 'react-redux';
import styles from './index.module.scss';

const tabs = [
  { id: 0, text: 'overview' },
  { id: 1, text: 'projects' },
  { id: 2, text: 'people' },
  { id: 3, text: 'jobs' },
];

interface TabItem {
  id: number;
  text: string;
}

const HorizontalTabs = () => {
  const dispatch = useDispatch();

  const handleButtonClick = (tabItem: TabItem) => {
    dispatch(selectedOrganisationPageTab(tabItem.id));
  };

  return (
    <div className={styles['horizontal-tabs']}>
      {tabs.map(tabItem => (
        <button key={tabItem.id} onClick={() => handleButtonClick(tabItem)}>
          {tabItem.text}
        </button>
      ))}
    </div>
  );
};

export default HorizontalTabs;
