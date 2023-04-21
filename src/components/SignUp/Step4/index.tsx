import { FC, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import clsx from 'clsx';
import styles from './index.module.scss';

interface IStep4 {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  showOptions: boolean;
  active: string;
}

const Step4: FC<IStep4> = ({
  setActive,
  setShowOptions,
  showOptions,
  active,
}) => {
  // useEffect(() => {
  //   setShowOptions(false);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <div className={styles['step4-container']}>
      {' '}
      <div className={styles['chat-prompts-container--chat-message']}>
        <div className={styles['user-image']} />
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
            <span className={styles['input-wrapper']}>
              <input placeholder="your email address" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step4;
