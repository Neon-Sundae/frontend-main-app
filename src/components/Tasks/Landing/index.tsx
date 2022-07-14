import { FC } from 'react';
import BlurBlobs from 'components/BlurBlobs';
import NavBar from 'components/NavBar';
import styles from './index.module.scss';
import AllTasks from '../AllTasks';

const Landing: FC = () => {
  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <AllTasks />
    </div>
  );
};
export default Landing;
