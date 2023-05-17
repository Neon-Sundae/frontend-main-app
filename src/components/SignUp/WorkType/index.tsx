import { TypeAnimation } from 'react-type-animation';
import { FC, useState } from 'react';
import clsx from 'clsx';
import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { UseFormRegister, useForm } from 'react-hook-form';
import { updateOnboardingData, updateSignUpStep } from 'actions/auth';
import { SignupSteps } from 'interfaces/auth';
import styles from './index.module.scss';
import PromptFooter from '../PromptFooter';

const choices = [
  'Engineering',
  'Product Design',
  'Creative',
  'Operations',
  'Product Manager',
  'Marketing',
  'Sales',
  'Founder / CEO',
  'Human Resources',
  'Other',
];

interface IWorkTypeForm {
  workType: string;
}

const WorkType: FC = () => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const { register, handleSubmit, watch } = useForm<IWorkTypeForm>();
  const onboardingData = useSelector(
    (state: RootState) => state.auth.onboardingData
  );

  const formValues = watch();

  const onSubmit = (data: IWorkTypeForm) => {
    dispatch(updateOnboardingData({ workType: data.workType }));
    dispatch(updateSignUpStep(SignupSteps.Objective));
  };

  const back = () => {
    dispatch(updateSignUpStep(SignupSteps.UserType));
  };

  return (
    <div className={styles['step-2-container']}>
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
              `Great ${onboardingData.name}! ✨ \n  What best describes the work that you do?`,
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
              {choices.map(choice => (
                <ChoiceButton
                  key={choice}
                  workType={formValues.workType}
                  text={choice}
                  register={register}
                />
              ))}
            </form>
          )}
        </div>
      </div>
      <PromptFooter prev={back} isDisabled={!formValues.workType} />
    </div>
  );
};

interface IChoiceButton {
  workType: string | null;
  text: string;
  register: UseFormRegister<IWorkTypeForm>;
}

const ChoiceButton: FC<IChoiceButton> = ({ register, workType, text }) => {
  return (
    <label
      htmlFor={text}
      className={clsx(
        styles['choice-option'],
        workType === text && styles.active
      )}
    >
      {text}
      <input id={text} type="radio" {...register('workType')} value={text} />
    </label>
  );
};

export default WorkType;
