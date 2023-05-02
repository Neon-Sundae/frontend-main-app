import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from 'utils/sessionStorageFunc';
import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';

import { useForm, useWatch } from 'react-hook-form';

import regexEmail from 'utils/regex/email';
import styles from './index.module.scss';

interface IStep4 {
  setActive: Dispatch<SetStateAction<string>>;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
  showOptions: boolean;
}

const Step7: FC<IStep4> = ({ setActive, setShowOptions, showOptions }) => {
  useEffect(() => {
    setActive('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const email = useWatch({
    control,
    name: 'email',
  });

  const emailFromSessionStorage = getSessionStorageItem('email');

  if (Object.keys(errors).length > 0) {
    setActive('');
  }

  if (Object.keys(errors).length === 0) {
    setSessionStorageItem('organisationEmail', email);
    setActive('1');
  }

  if (!email) {
    setActive('');
  }

  return (
    <div className={styles['step7-container']}>
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']}>
          <NeonSundaeMainLogo width={70} height={85.75} />
        </div>
        <div className={styles['user-choices']}>
          <TypeAnimation
            style={{
              whiteSpace: 'pre-line',
              display: 'block',
              marginBottom: '25px',
            }}
            defaultValue={email}
            sequence={[
              'Your workspace is almost ready 🚀 \n Drop your email below to keep up to date with all \n your projects, tasks and community',
              500,
              () => {
                setShowOptions(true);
              },
            ]}
            cursor={false}
            speed={80}
          />
          {showOptions && (
            <span className={styles['input-wrapper']}>
              <form autoComplete="off" onSubmit={e => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="email"
                  defaultValue={emailFromSessionStorage}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register('email', {
                    required: true,
                    pattern: regexEmail,
                  })}
                  style={{
                    border:
                      Object.keys(errors).length && '0.56px solid #FF8383',
                  }}
                />
                {Object.keys(errors).length > 0 && (
                  <p>* Your email looks so wrong!</p>
                )}
              </form>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step7;
