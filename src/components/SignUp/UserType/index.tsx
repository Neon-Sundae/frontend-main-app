import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { SignupSteps } from 'interfaces/auth';
import { updateOnboardingData, updateSignUpStep } from 'actions/auth';
import { trackAmplitudeEvent } from 'config/amplitude';
import PromptFooter from '../PromptFooter';
import styles from './index.module.scss';

interface IUserTypeForm {
  userType: string;
}

const UserType: FC = () => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const { register, handleSubmit, watch } = useForm<IUserTypeForm>();
  const onboardingData = useSelector(
    (state: RootState) => state.auth.onboardingData
  );

  const formValues = watch();

  const onSubmit = (data: IUserTypeForm) => {
    trackAmplitudeEvent('onb_usagepref_click', {
      usagepreference: data.userType,
    });
    dispatch(updateOnboardingData({ userType: data.userType }));
    dispatch(updateSignUpStep(SignupSteps.WorkType));
  };

  const back = () => {
    dispatch(updateSignUpStep(SignupSteps.Welcome));
  };

  return (
    <>
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']}>
          <NeonSundaeMainLogo width={70} height={85.75} />
        </div>
        <div className={styles['user-choices']}>
          <TypeAnimation
            style={{
              whiteSpace: 'pre-line',
              display: 'block',
            }}
            sequence={[
              `Hey ${onboardingData.name}, welcome to the Neonverse! ✨ \n We're excited to get you started, how are you planning \n to use Neon Sundae?`,
              500,
              () => {
                setShowOptions(true);
              },
            ]}
            cursor={false}
            speed={80}
          />
          {showOptions && (
            <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
              <label
                htmlFor="individual"
                className={clsx(
                  styles['choice-option'],
                  formValues.userType === 'Individual' && styles.active
                )}
              >
                👨‍💻 For Personal Use
                <input
                  id="individual"
                  type="radio"
                  {...register('userType')}
                  value="Individual"
                />
              </label>
              <label
                htmlFor="team"
                className={clsx(
                  styles['choice-option'],
                  formValues.userType === 'Team' && styles.active
                )}
              >
                👯 For My Team
                <input
                  id="team"
                  type="radio"
                  {...register('userType')}
                  value="Team"
                />
              </label>
            </form>
          )}
        </div>
      </div>
      <PromptFooter prev={back} isDisabled={!formValues.userType} />
    </>
  );
};

export default UserType;
