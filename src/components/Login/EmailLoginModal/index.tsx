import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import styles from './index.module.scss';
import { useOtpLogin, useVerifyOtp } from './hooks';

type Inputs = {
  email: string;
};

const EmailLoginModal = () => {
  const [email, setEmail] = useState<any>(undefined);
  const { refetch } = useOtpLogin(email);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (email && email.length > 0) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = (formData: Inputs) => {
    setEmail(formData.email);
    setStep(1);
  };

  return (
    <div className={styles[`email-login-container`]}>
      <Toaster />
      {step === 0 && (
        <>
          <p className={styles[`email-login-container--title`]}>
            Put your email to login with magic link
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <span>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register('email', {
                    required: true,
                  })}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </label>
              {errors.email && (
                <p className={styles[`email-login-container--error-message`]}>
                  Please enter an email.
                </p>
              )}
            </span>
            <button type="submit">Email OTP</button>
          </form>
        </>
      )}
      {step === 1 && <EmailSent email={email} setStep={setStep} />}
    </div>
  );
};

interface IEmailSentProps {
  email: string;
  setStep: Dispatch<SetStateAction<number>>;
}

const EmailSent: FC<IEmailSentProps> = ({ email, setStep }) => {
  const [otp, setOtp] = useState('');
  const { refetch: verifyOtp } = useVerifyOtp(email, otp);

  if (otp.length === 6) {
    setTimeout(() => {
      verifyOtp();
    }, 100);
  }

  return (
    <div className={styles[`email-login-container--mail-sent`]}>
      <h3>Email Sent</h3>
      <span>
        <p>We sent you an email with OTP.</p>
        <p>If you don&rsquo;t see it check your spam folder.</p>
      </span>
      <form>
        <input
          type="number"
          placeholder="Enter One Time Password"
          maxLength={6}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOtp(e.target.value)
          }
        />
        <button onClick={() => setStep(0)}>I didn&rsquo;t get an email</button>
      </form>
    </div>
  );
};

export default EmailLoginModal;
