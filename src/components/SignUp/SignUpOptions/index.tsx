import { FC } from 'react';
import { TypeAnimation } from 'react-type-animation';
import styles from './index.module.scss';
import SignUpForm from '../SignUpForm';

interface ISignUpOptions {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  showOptions: boolean;
  active: string;
}

const SignUpOptions: FC<ISignUpOptions> = ({
  setActive,
  setShowOptions,
  showOptions,
  active,
}) => {
  return (
    <div className={styles['sign-up-options-container']}>
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']} />
        <div className={styles['user-choices']}>
          <TypeAnimation
            style={{
              display: 'block',
            }}
            sequence={[
              'Beep boop... we are logging you into \n the Neonverse...',
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
              <span>
                <SignUpForm />
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpOptions;
