import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from 'utils/authFn';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'reducers';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founders-lab.svg';
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
        <FoundersLabIcon width={227} height={29} />
        {renderSteps()}
      </div>
    </div>
  );
};

export default LoginContainer;
