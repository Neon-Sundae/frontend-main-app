import { useState } from 'react';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import styles from './index.module.scss';
import Step0 from '../Step0';
import Step1 from '../Step1';
import Step2 from '../Step2';
import Step3 from '../Step3';
import Step4 from '../Step4';
import PromptFooter from '../PromptFooter';
import SignUpOptions from '../SignUpOptions';

import Step6 from '../Step6';
import Step7 from '../Step7';

const ChatPrompts = () => {
  const step = useSelector((state: RootState) => state.user.step);
  const [showOptions, setShowOptions] = useState(false);
  const [active, setActive] = useState('');

  return (
    <div
      className={clsx(
        styles['chat-prompts-container'],
        step === 0 && styles.auto
      )}
    >
      {step === 0 && <Step0 />}
      {step === 1 && (
        <>
          <Step1
            setShowOptions={setShowOptions}
            setActive={setActive}
            active={active}
            showOptions={showOptions}
          />
          <PromptFooter active={active === ''} />
        </>
      )}
      {step === 2 && (
        <>
          <Step2
            setShowOptions={setShowOptions}
            setActive={setActive}
            active={active}
            showOptions={showOptions}
          />
          <PromptFooter active={active === ''} />
        </>
      )}
      {step === 3 && (
        <>
          <Step3
            setShowOptions={setShowOptions}
            setActive={setActive}
            active={active}
            showOptions={showOptions}
          />
          <PromptFooter active={active === ''} />
        </>
      )}
      {step === 4 && (
        <>
          <Step4
            setShowOptions={setShowOptions}
            setActive={setActive}
            active={active}
            showOptions={showOptions}
          />
          <PromptFooter active={active === ''} />
        </>
      )}
      {(step === 5 || step === 13) && (
        <SignUpOptions
          setShowOptions={setShowOptions}
          setActive={setActive}
          active={active}
          showOptions={showOptions}
        />
      )}
      {step === 6 && (
        <>
          <Step3
            setShowOptions={setShowOptions}
            setActive={setActive}
            active={active}
            showOptions={showOptions}
          />
          <PromptFooter active={active === ''} />
        </>
      )}
      {(step === 7 ||
        step === 8 ||
        step === 9 ||
        step === 10 ||
        step === 11) && (
        <>
          <Step6
            setShowOptions={setShowOptions}
            setActive={setActive}
            active={active}
            showOptions={showOptions}
          />
          <PromptFooter active={active === ''} />
        </>
      )}
      {step === 12 && (
        <>
          <Step7
            setShowOptions={setShowOptions}
            setActive={setActive}
            active={active}
            showOptions={showOptions}
          />
          <PromptFooter active={active === ''} />
        </>
      )}
    </div>
  );
};

export default ChatPrompts;
