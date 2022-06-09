import { FC } from 'react';
import NavBar from 'components/NavBar';
import styles from './index.module.scss';
import Banner from '../Banner';

const Landing: FC = () => {
  return (
    <div className={styles.background}>
      <NavBar />
      <Banner />
    </div>
  );
};

export default Landing;
