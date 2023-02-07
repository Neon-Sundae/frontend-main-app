import NavBar from 'components/NavBar';
import { getAccessToken } from 'utils/authFn';
import { Navigate } from 'react-router-dom';

import useGetUserByWalletId from 'hooks/useGetUserByWalletId';
import useFetchOffChainProfile from 'hooks/useFetchOffChainProfile';
import BlurBlobs from 'components/BlurBlobs';
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
    <>
      <BlurBlobs />
      <div className={styles['error-404-container']}>
        <NavBar />
        <ErrorMessage message={message} errorCode={errorCode} />
      </div>
    </>
  );
}
