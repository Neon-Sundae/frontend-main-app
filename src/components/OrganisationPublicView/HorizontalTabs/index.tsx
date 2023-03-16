import { selectedOrganisationPageTab } from 'actions/organisation';
import clsx from 'clsx';
import { useState } from 'react';
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
  const [buttonSelected, setButtonSelected] = useState(0);

  const handleButtonClick = (tabItem: TabItem) => {
    setButtonSelected(tabItem.id);
    dispatch(selectedOrganisationPageTab(tabItem.id));
  };

  return (
    <div className={styles['horizontal-tabs']}>
      {tabs.map(tabItem => (
        <button
          key={tabItem.id}
          onClick={() => handleButtonClick(tabItem)}
          className={clsx(
            buttonSelected === tabItem.id
              ? styles['button-active']
              : styles['button-inactive']
          )}
        >
          {tabItem.text}
        </button>
      ))}

      <button className={styles['custom-button']}>Custom Button</button>
    </div>
  );
};

export default HorizontalTabs;
