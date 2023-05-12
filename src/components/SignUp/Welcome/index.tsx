/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-props-no-spreading */
import { useDispatch } from 'react-redux';
import { updateSignUpStep } from 'actions/auth';
import { useForm } from 'react-hook-form';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from 'utils/sessionStorageFunc';
import videoSrc from 'assets/videos/intro.mp4';
import { SignupSteps } from 'interfaces/auth';
import styles from './index.module.scss';

const Welcome = () => {
  const name = getSessionStorageItem('name');

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    setSessionStorageItem('name', data.name);
    if (!errors.name) dispatch(updateSignUpStep(SignupSteps.UserType));
  };

  return (
    <div className={styles['welcome-container']}>
      <div className={styles['video-frame']}>
        <video
          className={styles['background-video-container']}
          controls
          muted
          autoPlay
          poster="/src/assets/images/poster/intro-video.png"
        >
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
          disabled={Object.keys(errors).length > 0}
        />
      </form>
    </div>
  );
};

export default Welcome;
