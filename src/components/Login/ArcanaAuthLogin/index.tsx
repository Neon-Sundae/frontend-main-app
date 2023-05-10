import { useAuth, useProvider } from '@arcana/auth-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useArcanaWallet } from '../Step1/hooks';
import styles from './index.module.scss';

const ArcanaAuthLogin = () => {
  const auth = useAuth();

  const { provider } = useProvider();
  const { loginSuccess } = useArcanaWallet();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const triggerLoginSuccess = async () => {
      await loginSuccess(auth.user?.address, provider);
    };
    if (auth.user) {
      triggerLoginSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const linkLogin = async (formData: any) => {
    const { email } = formData;
    await auth.loginWithLink(email);
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
          <button onClick={() => navigate('/sign_up')}>Sign Up</button>
        </p>
      </span>
    </div>
  );
};

export default ArcanaAuthLogin;
