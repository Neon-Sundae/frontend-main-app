import { FC } from 'react';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import styles from './index.module.scss';
import AllTasks from '../AllTasks';

const Landing: FC = () => {
  return (
    <>
      <BlurBlobs />
      <div className={styles['all-task-container']}>
        <NavBar />
        <AllTasks />
      </div>
    </>
  );
};
export default Landing;
