import { FirstTimeUser } from 'components/Dashboard';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { Landing } from 'components/Home';
import Loading from 'components/Loading';

const Dashboard: FC = () => {
  const isFirstTimeUser = useSelector(
    (state: RootState) => state.auth.isFirstTimeUser
  );

  if (isFirstTimeUser === undefined) {
    return <Loading />;
  }

  if (isFirstTimeUser && !isFirstTimeUser) {
    return <FirstTimeUser />;
  }

  return <Landing />;
};

export default Dashboard;
