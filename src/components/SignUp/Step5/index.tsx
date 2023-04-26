import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { setSessionStorageItem } from 'utils/sessionStorageFunc';

import { useForm, useWatch } from 'react-hook-form';
import styles from './index.module.scss';

interface IStep5 {
  setActive: Dispatch<SetStateAction<string>>;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
  showOptions: boolean;
  active: string;
}

const Step5: FC<IStep5> = ({
  setActive,
  setShowOptions,
  showOptions,
  active,
}) => {
  useEffect(() => {
    setActive('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const orgName = useWatch({
    control,
    name: 'name',
  });

  if (Object.keys(errors).length > 0) {
    setActive('');
  }

  if (Object.keys(errors).length === 0) {
    setSessionStorageItem('orgName', orgName);
    setActive('1');
  }

  if (!orgName) {
    setActive('');
  }

  return (
    <>
      <div className={styles['step5-container']}>
        <div className={styles['chat-prompts-container--chat-message']}>
          <div className={styles['user-image']} />
          <div className={styles['user-choices']}>
            <TypeAnimation
              style={{
                whiteSpace: 'pre-line',
                display: 'block',
                marginBottom: '25px',
              }}
              defaultValue={orgName}
              sequence={[
                'Let’s build your organisation’s workflow 🚀 \n Give your organisation a name',
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
                    placeholder="Type here your organisation name"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...register('name', {
                      required: true,
                    })}
                    style={{
                      border:
                        Object.keys(errors).length && '0.56px solid #FF8383',
                    }}
                  />
                  {Object.keys(errors).length > 0 && <p>* Name is required</p>}
                </form>
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Step5;
