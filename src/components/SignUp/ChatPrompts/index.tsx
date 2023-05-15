import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { SignupSteps } from 'interfaces/auth';
import styles from './index.module.scss';
import Welcome from '../Welcome';
import UserType from '../UserType';
import WorkType from '../WorkType';
import Objective from '../Objective';
import Step4 from '../Step4';
import PromptFooter from '../PromptFooter';
import SignUpOptions from '../SignUpOptions';

import Step6 from '../Step6';
import Step7 from '../Step7';

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
      {step === SignupSteps.Email && <Step4 />}
      {step === SignupSteps.SignupOptions && <SignUpOptions />}
      {step === 6 && <Objective />}
      {step === SignupSteps.OrganisationOnboard && <Step6 />}
      {/* {step === 12 && (
        <>
          <Step7
            setShowOptions={setShowOptions}
            setActive={setActive}
            showOptions={showOptions}
          />
          <PromptFooter active={active === ''} />
        </>
      )} */}
    </div>
  );
};

export default ChatPrompts;
