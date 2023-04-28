/* eslint-disable react/jsx-props-no-spreading */
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { setSignUpStep } from 'actions/user';
import { useForm } from 'react-hook-form';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from 'utils/sessionStorageFunc';
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';
import styles from './index.module.scss';

const Step0 = () => {
  const step = useSelector((state: RootState) => state.user.step);
  const name = getSessionStorageItem('name');
  const [showInput, setShowInput] = useState(false);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    setSessionStorageItem('name', data.name);
    if (!errors.name) dispatch(setSignUpStep(step + 1));
  };

  return (
    <div className={styles['step0-container']}>
      <iframe
        title="video"
        width="900"
        height="480"
        src="https://www.loom.com/embed/eb1b9c6f21444b64940a632e2935007d"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2>
            Hey 👋
            {!showInput && (
              <TypeAnimation
                style={{
                  display: 'inline',
                  cursor: 'pointer',
                  width: '180px',
                }}
                sequence={[
                  ' Priya',
                  1000,
                  ' Michelle',
                  1000,
                  ' Natalia',
                  1000,
                  () => {
                    setShowInput(true); // Place optional callbacks anywhere in the array
                  },
                ]}
                cursor
                speed={80}
              />
            )}
            {showInput && (
              <input
                type="text"
                defaultValue={name}
                placeholder="Name "
                {...register('name', { required: true })}
                className={errors.name ? styles.error : ''}
              />
            )}
          </h2>
          {errors.name && <p>* Your name is required</p>}
        </div>
        <input
          type="submit"
          value="Get Started 🎉"
          className={styles['submit-button']}
          disabled={!!errors.name || !showInput}
        />
      </form>
    </div>
  );
};

export default Step0;
