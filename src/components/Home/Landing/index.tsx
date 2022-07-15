import { FC } from 'react';
import NavBar from 'components/NavBar';
import Tasks from '../Tasks';
import styles from './index.module.scss';
import Banner from '../Banner';
import Projects from '../Projects';
import { useQuery } from 'react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import BlurBlobs from 'components/BlurBlobs';
const Landing: FC = () => {
  const { isLoading, error, data, isFetching } = useQuery('newTasks', () =>
    fetch(`${config.ApiBaseUrl}/task/new`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    }).then((response) => response.json())
  );
  if (isFetching) return <p>Loading...</p>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
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
};

export default Landing;
