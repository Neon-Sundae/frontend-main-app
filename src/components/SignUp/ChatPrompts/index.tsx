import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { SignupSteps } from 'interfaces/auth';
import styles from './index.module.scss';
import Welcome from '../Welcome';
import UserType from '../UserType';
import WorkType from '../WorkType';
import Objective from '../Objective';
import EmailForm from '../EmailForm';
import SignUpOptions from '../SignUpOptions';
import OrganisationOnboard from '../OrganisationOnboard';

const ChatPrompts = () => {
  const step = useSelector((state: RootState) => state.auth.step);

  return (
    <div
      className={clsx(
        styles['chat-prompts-container'],
        step === SignupSteps.Welcome && styles.auto
      )}
    >
      {step === SignupSteps.Welcome && <Welcome />}
      {step === SignupSteps.UserType && <UserType />}
      {step === SignupSteps.WorkType && <WorkType />}
      {step === SignupSteps.Objective && <Objective />}
      {step === SignupSteps.Email && <EmailForm />}
      {step === SignupSteps.SignupOptions && <SignUpOptions />}
      {step === SignupSteps.OrganisationOnboard && <OrganisationOnboard />}
    </div>
  );
};

export default ChatPrompts;
