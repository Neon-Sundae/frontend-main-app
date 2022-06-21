import BlurBlobs from 'components/BlurBlobs';
import NavBar from 'components/NavBar';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import Banner from '../Banner';
import styles from './index.module.scss';

const Landing: FC = () => {
  const { orgId } = useParams();

  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <Banner />
    </div>
  );
};

export default Landing;
