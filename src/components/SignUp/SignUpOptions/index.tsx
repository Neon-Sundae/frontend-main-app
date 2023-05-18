import { FC, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import styles from './index.module.scss';
import SignUpForm from '../SignUpForm';

const SignUpOptions: FC = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className={styles['sign-up-options-container']}>
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']}>
          <NeonSundaeMainLogo width={70} height={85.75} />
        </div>
        <div className={styles['user-choices']}>
          <TypeAnimation
            sequence={[
              'Beep boop... we are logging you into the Neonverse...',
              500,
              () => {
                setShowOptions(true);
              },
            ]}
            cursor={false}
            speed={80}
          />
          {showOptions && <SignUpForm />}
        </div>
      </div>
    </div>
  );
};

export default SignUpOptions;
