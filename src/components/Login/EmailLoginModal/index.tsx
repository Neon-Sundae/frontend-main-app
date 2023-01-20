import { useState } from 'react';
import styles from './index.module.scss';

const EmailLoginModal = () => {
  const [email, setEmail] = useState(false);

  return (
    <div className={styles[`email-login-container`]}>
      {!email && (
        <>
          <p>Put your email to login with magic link</p>
          <form>
            <span>
              <label htmlFor="email">
                Email
                <input id="email" type="email" required />
              </label>
            </span>
            <button type="submit" onClick={() => setEmail(true)}>
              Email Magic Link
            </button>
          </form>
        </>
      )}
      {email && <EmailSent />}
    </div>
  );
};

const EmailSent = () => {
  return (
    <div className={styles[`email-login-container--mail-sent`]}>
      <h3>Email Sent</h3>
      <span>
        <p>We sent you an email with OTP.</p>
        <p>If you don&rsquo;t see it check your spam folder.</p>
      </span>
      <input placeholder="One Time Password" />
      <button>I didn&rsquo;t get an email</button>
    </div>
  );
};

export default EmailLoginModal;
