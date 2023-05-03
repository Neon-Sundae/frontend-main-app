/* eslint-disable jsx-a11y/media-has-caption */
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
import videoSrc from 'assets/videos/intro.mp4';
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
      <div className={styles['video-frame']}>
        <video
          autoPlay
          muted
          loop
          className={styles['background-video-container']}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
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
          value="Get Started&nbsp;&nbsp;🎉"
          className={styles['submit-button']}
          disabled={!!errors.name || !showInput}
        />
      </form>
    </div>
  );
};

export default Step0;
