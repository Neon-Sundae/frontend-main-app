import NavBar from 'components/NavBar';
import { getAccessToken } from 'utils/authFn';
import { Navigate } from 'react-router-dom';
import BlurBlobs from 'components/BlurBlobs';
import { useFetchUserDetailsByWallet } from 'queries/user';
import { useFetchProfileDetailsByUser } from 'queries/profile';
import styles from './index.module.scss';
import ErrorMessage from './ErrorMessage';

export default function Error() {
  const accessToken = getAccessToken();
  const { data: userData } = useFetchUserDetailsByWallet();
  useFetchProfileDetailsByUser({ userId: userData?.user?.userId });

  if (!accessToken) return <Navigate to="/login" />;

  return (
    <>
      <BlurBlobs />
      <div className={styles['error-404-container']}>
        <NavBar />
        <ErrorMessage
          message="The location couldn't be found"
          errorCode={404}
        />
      </div>
    </>
  );
}
