import { FC, useState } from 'react';
import NavBar from 'components/NavBar';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import BlurBlobs from 'components/BlurBlobs';
import useFetchOffChainProfile from 'hooks/useFetchOffChainProfile';
import TourHomePage from './tour';
import Tasks from '../Tasks';
import Banner from '../Banner';
import Projects from '../Projects';
import styles from './index.module.scss';

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
      <div className={styles.background}>
        <NavBar />
        <BlurBlobs />
        <Banner />
        <section className={styles.content}>
          <Projects />
          <Tasks data={data} />
        </section>
      </div>
    );
  }

  return null;
};

export default Landing;
