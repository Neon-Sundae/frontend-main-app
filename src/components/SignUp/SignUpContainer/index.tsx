import { Toaster } from 'react-hot-toast';
import BlurBlobs from '../BlurBlobs';
import styles from './index.module.scss';
import StepProgressBar from '../StepProgressBar';
import ChatPrompts from '../ChatPrompts';

const SignUpContainer = () => {
  return (
    <>
      <BlurBlobs />
      <Toaster />
      <div className={styles['sign-up-container']}>
        <StepProgressBar />
        <ChatPrompts />
      </div>
    </>
  );
};

export default SignUpContainer;
