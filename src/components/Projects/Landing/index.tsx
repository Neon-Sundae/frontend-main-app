import { FC } from 'react';
import styles from './index.module.scss';
import BlurBlobs from 'components/BlurBlobs';
import NavBar from 'components/NavBar';
import AllProjects from '../AllProjects';
import config from 'config';
import { useQuery } from 'react-query';
import { getAccessToken } from 'utils/authFn';

const Landing: FC = () => {
  const { isLoading, error, data, isFetching } = useQuery(
    'allProjects',
    () =>
      fetch(`${config.ApiBaseUrl}/fl-project/all`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then((response) => response.json()),
    {
      refetchOnWindowFocus: false,
    }
  );
  if (isFetching) return <p>Loading...</p>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <AllProjects projectData={data} />
    </div>
  );
};

export default Landing;
