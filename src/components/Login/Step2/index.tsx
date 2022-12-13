import { FC, useEffect } from 'react';
import { ReactComponent as SuccessIcon } from 'assets/illustrations/icons/success.svg';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { updateCurrentStep } from 'actions/auth';
import styles from './index.module.scss';

const Step2: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
      dispatch(updateCurrentStep(1));
    }, 3 * 1000);

    return () => {
      clearTimeout(timer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1 className={styles.title}>Success!</h1>
      <div className={styles['connection-container']}>
        <MetamaskIcon width={23} height={22} />
        <span className={styles['connection-text']}>
          You&apos;re connected with{' '}
          {`${user && user.walletId?.slice(0, 4)}...${
            user && user.walletId?.slice(38)
          }`}
        </span>
      </div>
      <p className={styles['success-text']}>
        Authentication is succesful, wait for a few seconds to automatically
        open dashboard.
      </p>
    </>
  );
};

export default Step2;
