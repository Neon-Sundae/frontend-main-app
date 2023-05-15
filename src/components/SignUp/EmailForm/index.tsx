import { FC, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useDispatch } from 'react-redux';
import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import { useForm } from 'react-hook-form';
import { updateOnboardingData } from 'actions/auth';
import regexEmail from 'utils/regex/email';
import { SignupSteps } from 'interfaces/auth';
import styles from './index.module.scss';
import PromptFooter from '../PromptFooter';

interface IEmailTypeForm {
  email: string;
}

const EmailForm: FC = () => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IEmailTypeForm>();

  const formValues = watch();

  const onSubmit = (data: IEmailTypeForm) => {
    dispatch(updateOnboardingData({ email: data.email }));
  };

  return (
    <div className={styles['step4-container']}>
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']}>
          <NeonSundaeMainLogo width={70} height={85.75} />
        </div>
        <div className={styles['user-choices']}>
          <TypeAnimation
            style={{
              whiteSpace: 'pre-line',
              display: 'block',
              marginBottom: '25px',
            }}
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
            <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="email address here"
                {...register('email', {
                  required: true,
                })}
                style={{
                  border: Object.keys(errors).length && '0.56px solid #FF8383',
                }}
              />
              {Object.keys(errors).length > 0 && (
                <p>* Your email looks so wrong!</p>
              )}
            </form>
          )}
        </div>
      </div>
      <PromptFooter
        prev={SignupSteps.Objective}
        next={SignupSteps.SignupOptions}
        isDisabled={!regexEmail.test(formValues.email)}
      />
    </div>
  );
};

export default EmailForm;
