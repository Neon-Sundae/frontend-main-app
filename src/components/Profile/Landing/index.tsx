import { FC } from 'react';
import NavBar from 'components/NavBar';
import ProfileCard from '../ProfileCard';
import styles from './index.module.scss';

const Landing: FC = () => {
  return (
    <div className={styles.container}>
      <NavBar />
      <ProfileCard />
    </div>
  );
};

export default Landing;
