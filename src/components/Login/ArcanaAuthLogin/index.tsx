import { useAuth, useProvider } from '@arcana/auth-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DiscordIcon from 'assets/illustrations/icons/login/discord.png';
import GoogleIcon from 'assets/illustrations/icons/login/google.png';
import clsx from 'clsx';
import { ProgressBar } from 'react-loader-spinner';
import { useRef } from 'react';
import { useArcanaWallet } from '../Step1/hooks';
import styles from './index.module.scss';

const ArcanaAuthLogin = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const auth = useAuth();
  const { provider } = useProvider();
  const { loginSuccess } = useArcanaWallet();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const linkLogin = async (data: any) => {
    const { email } = data;
    await auth.loginWithLink(email);
  };

  const socialLogin = async (option: string) => {
    await auth.loginWithSocial(option);

    await loginSuccess(auth.user?.address, provider);
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
          {errors.email && <span>This field is required</span>}
          <button type="submit">
            <i className={clsx('material-icons', styles['chevron-right'])}>
              chevron_right
            </i>
          </button>
        </form>
      </span>
      <p className={styles[`arcana-auth--section-heading`]}>or continue with</p>
      <div className={styles[`arcana-auth--social`]}>
        {auth.loading && (
          <ProgressBar
            ariaLabel="loading-indicator"
            height={50}
            width={50}
            borderColor="#cf92ff"
            barColor="#fcfcfc"
          />
        )}
        {auth.availableLogins.map((option: string) => (
          <button
            key={`${option}-key`}
            onClick={() => socialLogin(option)}
            ref={buttonRef}
            id={`${option}-key`}
          >
            {option === 'discord' && (
              <img src={DiscordIcon} alt="Discord Login Button" />
            )}
            {option === 'google' && (
              <img src={GoogleIcon} alt="Google Login Button" />
            )}
          </button>
        ))}
      </div>
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
