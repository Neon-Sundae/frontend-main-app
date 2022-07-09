import { FC } from 'react';
import { Toaster } from 'react-hot-toast';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import TaskManagement from 'components/TaskManagement';
import Header from '../Header';
import Description from '../Description';
import styles from './index.module.scss';

const Landing: FC = () => {
  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <Header />
      <Description />
      <TaskManagement />
      <Toaster />
    </div>
  );
};

export default Landing;
