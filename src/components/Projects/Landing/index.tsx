import { FC } from 'react';
import bg from 'assets/illustrations/gradients/bg.png';
import NavBar from 'components/NavBar';
import config from 'config';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import AllProjects from '../AllProjects';
import styles from './index.module.scss';

const Landing: FC = () => {
  const { isLoading, error, data, isFetching } = useQuery(
    ['allProjects'],
    () =>
      fetch(`${config.ApiBaseUrl}/fl-project/all`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then(response => response.json()),
    {
      refetchOnWindowFocus: false,
    }
  );
  if (isFetching) return null;
  if (isLoading) return null;
  if (error) return null;
  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'space',
        backgroundAttachment: 'fixed',
      }}
    >
      <NavBar />
      <AllProjects projectData={data} />
    </div>
  );
};

export default Landing;
