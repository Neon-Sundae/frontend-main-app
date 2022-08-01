import { FC } from 'react';
import NavBar from 'components/NavBar';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import BlurBlobs from 'components/BlurBlobs';
import useFetchOffChainProfile from 'hooks/useFetchOffChainProfile';
import Tasks from '../Tasks';
import Banner from '../Banner';
import Projects from '../Projects';
import styles from './index.module.scss';

const Landing: FC = () => {
  // const { offChainProfile } = useFetchOffChainProfile();

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
