import { FirstTimeUser } from 'components/Dashboard';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { Landing } from 'components/Home';
import { useNavigate } from 'react-router-dom';
import { removeAccessToken } from 'utils/authFn';
const Dashboard: FC = () => {
  const navigate = useNavigate();
  const isFirstTimeUser = useSelector(
    (state: RootState) => state.auth.isFirstTimeUser
  );

  if (isFirstTimeUser === undefined) {
    return <p>Loading...</p>;
  }

  if (!isFirstTimeUser) {
    return <FirstTimeUser />;
  }

  return (
    <>
      <button
        onClick={() => {
          navigate('/profile');
        }}
      >
        Profile
      </button>
      <button
        onClick={() => {
          removeAccessToken();
          navigate('/login');
        }}
      >
        Logout
      </button>
      <Landing />
    </>
  );
};

export default Dashboard;
