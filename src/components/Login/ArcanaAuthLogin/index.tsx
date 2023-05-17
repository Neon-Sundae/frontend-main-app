import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { useEffect } from 'react';
import styles from './index.module.scss';
import { useArcanaLogin } from '../Step1/hooks';

interface IEmailFormData {
  email: string;
}

const ArcanaAuthLogin = () => {
  const navigate = useNavigate();
  const { arcanaEmailLoginInit, arcanaLogin } = useArcanaLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IEmailFormData>();
  const arcanaAuth = useSelector((state: RootState) => state.auth.arcanaAuth);

  useEffect(() => {
    (async () => {
      if (arcanaAuth.address) {
        await arcanaLogin(arcanaAuth.address);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arcanaAuth.address]);

  const linkLogin = async (data: IEmailFormData) => {
    await arcanaEmailLoginInit(data.email);
  };

  return (
    <div className={styles[`arcana-auth`]}>
      <p className={styles[`arcana-auth--section-heading`]}>
        or login via email
      </p>
      <span className={styles[`arcana-auth--email`]}>
        <form onSubmit={handleSubmit(linkLogin)}>
          <input
            placeholder="Enter your email"
            type="email"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('email', { required: true })}
          />

          <button type="submit">
            <i className={clsx('material-icons', styles['chevron-right'])}>
              chevron_right
            </i>
          </button>
        </form>
        {errors.email && <span>* This field is required</span>}
      </span>

      <span className={styles[`arcana-auth--footer`]}>
        <p>
          Don&apos;t have an account? &nbsp;
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </p>
      </span>
    </div>
  );
};

export default ArcanaAuthLogin;
