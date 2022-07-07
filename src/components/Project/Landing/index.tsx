import { FC } from 'react';
import NavBar from 'components/NavBar';
import styles from './index.module.scss';
import BlurBlobs from 'components/BlurBlobs';
import TaskManagement from 'components/TaskManagement';
import Header from '../Header';
import Description from '../Description';

const Landing: FC = () => {
  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <Header />
      <Description />
      <TaskManagement />
    </div>
  );
};

export default Landing;
