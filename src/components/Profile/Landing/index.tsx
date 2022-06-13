import { FC } from 'react';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import ProfileCard from '../ProfileCard';
import styles from './index.module.scss';
import useGetProfileData from './hooks';
import ProfileContent from '../ProfileContent';

const Landing: FC = () => {
  useGetProfileData();

  return (
    <div className={styles.container}>
      {/* <Box /> */}
      <BlurBlobs />
      <NavBar />
      <div className={styles['profile-card-content-container']}>
        <ProfileCard />
        <ProfileContent />
      </div>
    </div>
  );
};

const Box: FC = () => {
  return (
    <div className={styles['box-1']}>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex, deleniti!
      </p>
    </div>
  );
};

export default Landing;
