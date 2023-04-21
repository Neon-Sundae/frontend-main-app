import { useState } from 'react';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';
import Step1 from '../Step1';
import Step2 from '../Step2';
import Step3 from '../Step3';
import Step4 from '../Step4';
import PromptFooter from './PromptFooter';
import SignUpOptions from '../SignUpOptions';

const ChatPrompts = () => {
  const step = useSelector((state: RootState) => state.user.step);

  const [showOptions, setShowOptions] = useState(false);
  const [active, setActive] = useState('');

  return (
    <div className={styles['chat-prompts-container']}>
      {step === 1 && (
        <Step1
          setShowOptions={setShowOptions}
          setActive={setActive}
          active={active}
          showOptions={showOptions}
        />
      )}
      {step === 2 && (
        <Step2
          setShowOptions={setShowOptions}
          setActive={setActive}
          active={active}
          showOptions={showOptions}
        />
      )}
      {step === 3 && (
        <Step3
          setShowOptions={setShowOptions}
          setActive={setActive}
          active={active}
          showOptions={showOptions}
        />
      )}
      {step === 4 && (
        <Step4
          setShowOptions={setShowOptions}
          setActive={setActive}
          active={active}
          showOptions={showOptions}
        />
      )}
      {step === 5 && (
        <SignUpOptions
          setShowOptions={setShowOptions}
          setActive={setActive}
          active={active}
          showOptions={showOptions}
        />
      )}
      {step !== 5 && <PromptFooter />}
    </div>
  );
};

export default ChatPrompts;
