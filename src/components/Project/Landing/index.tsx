import { FC } from 'react';
import styles from './index.module.scss';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import Header from '../Header';
import Description from '../Description';

const Landing: FC = () => {
  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <Header />
      <Description />
    </div>
  );
};

export default Landing;
