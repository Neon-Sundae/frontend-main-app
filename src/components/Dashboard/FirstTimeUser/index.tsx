import clsx from 'clsx';
import { FC, FormEvent, useState } from 'react';
import { validateCreateProfile } from 'validations/auth';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founders-lab-light.svg';
import { Background } from 'components/Login';
import styles from './index.module.scss';
import useCreateProfile from './hooks';
import BaseBlob from 'components/BaseBlob';

const FirstTimeUser: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState({
    nameError: false,
    emailError: false,
    apiError: false,
  });

  const createProfile = useCreateProfile();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateCreateProfile(name, email, setError)) {
      createProfile({ name, email });
    }
  };

  return (
    <>
      <Background />
      <div className={styles.LoginContainer}>
        <div className={styles.StepContainer}>
          <FoundersLabIcon width={200} height={26} />
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
          <h1 className={styles.title}>Create your profile</h1>
          <form className={styles['form-container']} onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              className={clsx(
                styles['form-input'],
                error.nameError && styles['form-input--error']
              )}
            >
              Name
              <input
                required
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            {error.nameError && (
              <p className={styles['error-text']}>Enter a valid name</p>
            )}
            <label htmlFor="email" className={styles['form-input']}>
              Email
              <input
                required
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            {error.emailError && (
              <p className={styles['error-text']}>Enter a valid email</p>
            )}
            <input
              type="submit"
              value="Let's get started!"
              className={styles['form-submit-btn']}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default FirstTimeUser;
