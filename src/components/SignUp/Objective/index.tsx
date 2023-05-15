import { FC, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import { UseFormRegister, useForm } from 'react-hook-form';
import { RootState } from 'reducers';
import { SignupSteps } from 'interfaces/auth';
import { updateOnboardingData } from 'actions/auth';
import styles from './index.module.scss';
import PromptFooter from '../PromptFooter';

const choices = [
  'Collaboratively build projects with community',
  'Manage projects',
  'Post jobs and hire Superstars',
  'Find jobs',
  'Host and run hackathons',
  'Sales & CRM',
  'Build and manage workflows',
  'Others',
];

interface IObjectiveForm {
  objective: string[];
}

const Objective: FC = () => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitted },
  } = useForm<IObjectiveForm>();
  const onboardingData = useSelector(
    (state: RootState) => state.auth.onboardingData
  );

  const formValues = watch();

  const onSubmit = (data: IObjectiveForm) => {
    dispatch(updateOnboardingData({ objective: data.objective }));
  };

  return (
    <div className={styles['step3-container']}>
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']}>
          <NeonSundaeMainLogo width={70} height={85.75} />
        </div>
        <div className={styles['user-choices']}>
          <TypeAnimation
            style={{
              display: 'block',
            }}
            sequence={[
              `Awesome stuff ${onboardingData.name}, how are you planning to \n use Neon Sundae?`,
              500,
              () => {
                setShowOptions(true);
              },
            ]}
            cursor={false}
            speed={80}
          />

          {showOptions && (
            <>
              <p className={styles['user-choices--text']}>
                * Choose one or more
              </p>
              <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
                {choices.map(choice => {
                  return (
                    <ChoiceButton
                      key={choice}
                      objective={formValues.objective}
                      text={choice}
                      register={register}
                    />
                  );
                })}
              </form>
            </>
          )}
        </div>
      </div>
      <PromptFooter
        prev={SignupSteps.WorkType}
        next={SignupSteps.Email}
        isDisabled={!formValues.objective}
        isSubmitted={isSubmitted}
      />
    </div>
  );
};

interface IChoiceButton {
  text: string;
  objective: string[] | null;
  register: UseFormRegister<IObjectiveForm>;
}

const ChoiceButton: FC<IChoiceButton> = ({ text, objective, register }) => {
  const isActive = () => {
    if (!objective) return false;
    return objective.includes(text);
  };

  return (
    <label
      htmlFor={text}
      className={clsx(styles['choice-option'], isActive() && styles.active)}
    >
      {text}
      <input
        id={text}
        type="checkbox"
        {...register('objective')}
        value={text}
      />
    </label>
  );
};

export default Objective;
