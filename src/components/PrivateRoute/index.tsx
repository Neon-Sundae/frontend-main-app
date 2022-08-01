import useFetchOffChainProfile from 'hooks/useFetchOffChainProfile';
import useGetUserByWalletId from 'hooks/useGetUserByWalletId';
import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';

interface ComponentProps {
  children: ReactElement;
}

const PrivateRoute: FC<ComponentProps> = ({ children }) => {
  const accessToken = getAccessToken();
  useGetUserByWalletId();
  useFetchOffChainProfile();

  if (accessToken === undefined) {
    // TODO - Add Loading spinner
    return <p>Loading pvt route...</p>;
  }

  if (accessToken) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;
