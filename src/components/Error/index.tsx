import NavBar from 'components/NavBar';
import bg from 'assets/illustrations/gradients/bg.png';
import { getAccessToken } from 'utils/authFn';
import { Navigate } from 'react-router-dom';

import useGetUserByWalletId from 'hooks/useGetUserByWalletId';
import useFetchOffChainProfile from 'hooks/useFetchOffChainProfile';
import styles from './index.module.scss';
import ErrorMessage from './ErrorMessage';

export default function Error() {
  const message = "The location couldn't be found";
  const errorCode = 404;
  const accessToken = getAccessToken();
  useGetUserByWalletId();
  useFetchOffChainProfile();
  if (!accessToken) return <Navigate to="/login" />;
  return (
    <div
      className={styles['error-404-container']}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'space',
        backgroundAttachment: 'fixed',
      }}
    >
      <NavBar />
      <ErrorMessage message={message} errorCode={errorCode} />
    </div>
  );
}
