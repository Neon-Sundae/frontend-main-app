import { FC, useEffect } from 'react';
import styles from './index.module.scss';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import Header from '../Header';
import Description from '../Description';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';

const Landing: FC = () => {
  const { create } = useParams();
  const userName = useSelector((state: RootState) => state.user.user?.name);
  console.log(userName);
  const { isLoading, error, data, isFetching } = useQuery('userOrgs', () =>
    fetch(`${config.ApiBaseUrl}/fl-project/${create}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    }).then((response) => response.json())
  );
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error :|</p>;
  const {
    name,
    description,
    budget,
    timeOfCompletion,
    preferredTimeZones,
    flResources,
  } = data;
  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <Header projectName={name} founderName={userName || ''} />
      <Description
        description={description}
        budget={budget}
        timeOfCompletion={timeOfCompletion}
        preferredTimeZones={preferredTimeZones}
        flResources={flResources}
      />
    </div>
  );
};

export default Landing;
