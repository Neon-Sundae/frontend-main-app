import { FirstTimeUser } from 'components/Dashboard';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'reducers';
import { removeAccessToken } from 'utils/authFn';

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const isFirstTimeUser = useSelector(
    (state: RootState) => state.auth.isFirstTimeUser
  );
  const user = useSelector((state: RootState) => state.user.user);

  if (isFirstTimeUser === undefined) {
    return <p>Loading...</p>;
  }

  if (!isFirstTimeUser) {
    return <FirstTimeUser />;
  }

  const handleLogout = () => {
    removeAccessToken();
    navigate('/login');
  };

  return (
    <>
      <h1>Dashboard page</h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Wallet: {user?.walletId}</p>
      <button type="button" onClick={handleLogout}>
        Disconnect
      </button>
    </>
  );
};

export default Dashboard;
