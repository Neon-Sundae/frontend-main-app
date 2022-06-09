import { FC } from 'react';
import NavBar from 'components/NavBar';
import ProfileCard from '../ProfileCard';
import styles from './index.module.scss';
import useGetProfileData from './hooks';

const Landing: FC = () => {
  useGetProfileData();

  return (
    <div className={styles.container}>
      <NavBar />
      <ProfileCard />
    </div>
  );
};

export default Landing;
