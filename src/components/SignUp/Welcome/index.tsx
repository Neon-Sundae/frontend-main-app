import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { updateOnboardingData, updateSignUpStep } from 'actions/auth';
import { useForm } from 'react-hook-form';
import videoSrc from 'assets/videos/intro.mp4';
import { SignupSteps } from 'interfaces/auth';
import styles from './index.module.scss';

interface IWelcomeForm {
  name: string;
}

const Welcome = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IWelcomeForm>();

  const onboardingData = useSelector(
    (state: RootState) => state.auth.onboardingData
  );

  const onSubmit = (data: IWelcomeForm) => {
    dispatch(updateOnboardingData({ name: data.name }));
    dispatch(updateSignUpStep(SignupSteps.UserType));
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
              defaultValue={onboardingData.name}
              placeholder="Your name"
              {...register('name', { required: true })}
              className={errors.name ? styles.error : ''}
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
