import { useFetchProfileDetailsByUser } from 'queries/profile';
import { useFetchUserDetailsByWallet } from 'queries/user';
import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';

interface ComponentProps {
  children: ReactElement;
}

const PrivateRoute: FC<ComponentProps> = ({ children }) => {
  const accessToken = getAccessToken();
  const location = useLocation();
  const { data: userData } = useFetchUserDetailsByWallet();
  useFetchProfileDetailsByUser({ userId: userData?.user?.userId });

  if (accessToken === undefined) {
    // TODO - Add Loading spinner
    return <p>Loading pvt route...</p>;
  }

  if (accessToken) {
    return children;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;
