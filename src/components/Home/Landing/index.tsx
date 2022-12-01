import { FC, useState } from 'react';
import NavBar from 'components/NavBar';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import BlurBlobs from 'components/BlurBlobs';
import bg from 'assets/illustrations/gradients/bg.png';
import clsx from 'clsx';
import Shepherd from 'shepherd.js';
import TourHomePage from './tour';
import Tasks from '../Tasks';
import Banner from '../Banner';
import Projects from '../Projects';
import styles from './index.module.scss';
import MyTasks from '../MyTasks';
import MyProjects from '../MyProjects';
import NewJobs from '../NewJobs';

const Landing: FC = () => {
  const [checkOnboardStatus, setCheckOnboardStatus] = useState(
    localStorage.getItem('onboardStatus')
  );
  const [showOnboardModal, setShowOnboardModal] = useState(false);

  const { tourStart } = TourHomePage();
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
    if (!Shepherd.activeTour?.isActive()) {
      setTimeout(() => {
        setShowOnboardModal(true);
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
        <Banner
          showOnboardModal={showOnboardModal}
          setShowOnboardModal={setShowOnboardModal}
          tourStart={tourStart}
        />
        <section className={styles.content}>
          <Projects />
          <Tasks data={data} />
        </section>
        <section>
          <NewJobs />
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
