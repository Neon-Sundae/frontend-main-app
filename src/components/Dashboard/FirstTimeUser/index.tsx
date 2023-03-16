import clsx from 'clsx';
import { FC, FormEvent, useState } from 'react';
import { validateCreateProfile } from 'validations/auth';
import { ReactComponent as NeonSundaeLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import { Background } from 'components/Login';
import BaseBlob from 'components/BaseBlob';
import { getItem } from 'utils/sessionStorageFunc';
import { handleLocalStorage } from 'utils/localStorageFn';
import { useAuth } from '@arcana/auth-react';
import styles from './index.module.scss';
import useCreateProfile from './hooks';

const FirstTimeUser: FC = () => {
  const auth = useAuth();
  const [name, setName] = useState(getItem('name') ?? '');
  const [email, setEmail] = useState(auth?.user?.email ?? '');
  const [error, setError] = useState({
    nameError: false,
    emailError: false,
    apiError: false,
  });

  const createProfile = useCreateProfile();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLocalStorage('started');
    if (validateCreateProfile(name, email, setError)) {
      createProfile.mutate({ name, email });
    }
  };

  return (
    <>
      <Background />
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
                disabled={!!getItem('name')}
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
                disabled={!!auth?.user?.email}
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
