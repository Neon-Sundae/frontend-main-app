import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from 'utils/authFn';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'reducers';
import { ReactComponent as NeonSundaeLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import BaseBlob from 'components/BaseBlob';
import Step1 from '../Step1';
import Step2 from '../Step2';
import styles from './index.module.scss';

const LoginContainer: FC = () => {
  const navigate = useNavigate();
  const currentStep = useSelector((state: RootState) => state.auth.currentStep);
  useEffect(() => {
    const accessToken = getAccessToken();

    if (accessToken) {
      navigate('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSteps = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.LoginContainer}>
      <div className={styles.StepContainer}>
        <NeonSundaeLogo
          width={131}
          height={100}
          style={{ marginTop: '10px' }}
        />
        <BaseBlob
          blobColor="rgba(247, 153, 255, 1)"
          width={270}
          height={270}
          className="login-container-blob-pink"
        />
        <BaseBlob
          blobColor="rgba(167, 153, 255, 1)"
          width={270}
          height={270}
          className="login-container-blob-purple"
        />
        {renderSteps()}
      </div>
    </div>
  );
};

export default LoginContainer;
