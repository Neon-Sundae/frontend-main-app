import { FC, useState } from 'react';
import NavBar from 'components/NavBar';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import BlurBlobs from 'components/BlurBlobs';
import useFetchOffChainProfile from 'hooks/useFetchOffChainProfile';
import bg from 'assets/illustrations/gradients/bg.png';
import clsx from 'clsx';
import TourHomePage from './tour';
import Tasks from '../Tasks';
import Banner from '../Banner';
import Projects from '../Projects';
import styles from './index.module.scss';
import MyTasks from '../MyTasks';
import MyProjects from '../MyProjects';

const Landing: FC = () => {
  // const { offChainProfile } = useFetchOffChainProfile();
  const [checkOnboardStatus, setCheckOnboardStatus] = useState(
    localStorage.getItem('onboardStatus')
  );
  const { tourActive, tourStart } = TourHomePage();
  const { data } = useQuery(
    ['newTasks'],
    () =>
      fetch(`${config.ApiBaseUrl}/task/new`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then(response => response.json()),
    {
      refetchOnWindowFocus: false,
    }
  );
  if (checkOnboardStatus && checkOnboardStatus === 'started') {
    if (!tourActive()) {
      setTimeout(() => {
        tourStart();
      }, 1000);
    }
  }
  if (data) {
    return (
      <div
        className={styles.background}
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'space',
          backgroundAttachment: 'fixed',
        }}
      >
        <NavBar />
        <BlurBlobs />
        <Banner />
        <section className={styles.content}>
          <Projects />
          <Tasks data={data} />
        </section>
        <section className={clsx(styles.content, styles['my-tasks-wrap'])}>
          <MyTasks />
        </section>
        <section className={styles['my-projects-wrap']}>
          <MyProjects />
        </section>
      </div>
    );
  }

  return null;
};

export default Landing;
