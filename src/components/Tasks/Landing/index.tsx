import { FC } from 'react';
import BlurBlobs from 'components/BlurBlobs';
import bg from 'assets/illustrations/home/all-task-bg.svg';
import NavBar from 'components/NavBar';
import styles from './index.module.scss';
import AllTasks from '../AllTasks';

const Landing: FC = () => {
  return (
    <div
      className={styles['all-task-container']}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* <BlurBlobs /> */}
      <NavBar />
      <AllTasks />
    </div>
  );
};
export default Landing;
