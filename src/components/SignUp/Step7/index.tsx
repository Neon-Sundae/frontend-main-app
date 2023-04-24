import { FC, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from 'utils/sessionStorageFunc';

import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';

interface IStep4 {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  showOptions: boolean;
  active: string;
}

const Step7: FC<IStep4> = ({
  setActive,
  setShowOptions,
  showOptions,
  active,
}) => {
  const step = useSelector((state: RootState) => state.user.step);
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
    setSessionStorageItem('email', email);
    setActive('1');
  }

  if (!email) {
    setActive('');
  }

  return (
    <div className={styles['step7-container']}>
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']} />
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
              <form>
                <input
                  type="text"
                  placeholder="email"
                  defaultValue={emailFromSessionStorage}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register('email', {
                    required: true,
                    pattern:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                  style={{
                    border:
                      Object.keys(errors).length && '0.56px solid #FF8383',
                  }}
                />
                {Object.keys(errors).length > 0 && (
                  <p>* Your email looks wrong!</p>
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
