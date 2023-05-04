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

import { useState } from 'react';
import videoSrc from 'assets/videos/intro.mp4';
import styles from './index.module.scss';

const Step0 = () => {
  const step = useSelector((state: RootState) => state.user.step);
  const name = getSessionStorageItem('name');

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
        <video muted className={styles['background-video-container']} controls>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2>
            Hey
            <input
              type="text"
              defaultValue={name}
              placeholder="Your name"
              {...register('name', { required: true })}
              className={errors.name ? styles.error : ''}
              // eslint-disable-next-line jsx-a11y/no-autofocus
            />
            &nbsp;! 👋
          </h2>
          {errors.name && <p>* Your name is required</p>}
        </div>
        <h3>Welcome to Neon Sundae</h3>
        <input
          type="submit"
          value="Get Started&nbsp;&nbsp;🎉"
          className={styles['submit-button']}
          disabled={!!errors.name}
        />
      </form>
    </div>
  );
};

export default Step0;
