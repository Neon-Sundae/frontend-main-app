import neonSundaeLogo from 'assets/illustrations/icons/neonSundaeMainLogo.png';
import BlurBlobs from 'components/BlurBlobs';
import TopGradientBar from 'components/TopGradientBar';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Step0 from '../Step0';
import Step1 from '../Step1';
import Step2 from '../Step2';
import Step3 from '../Step3';
import styles from './index.module.scss';

const SignUpContainer = () => {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <>
      <TopGradientBar />
      <BlurBlobs />
      <Toaster />
      <div className={styles['sign-up-container']}>
        <div className={styles['sign-up-container--content']}>
          <img
            className={styles['sign-up-container--logo']}
            src={neonSundaeLogo}
            alt="Neon Sundae Logo"
          />
          <p className={styles['sign-up-container--heading-text']}>
            Welcome to Neon Sundae
          </p>
          {auth.currentSignUpStep === 'step0' && <Step0 />}
          {auth.currentSignUpStep === 'step1' && <Step1 />}
          {auth.currentSignUpStep === 'step2' && <Step2 />}
          {auth.currentSignUpStep === 'step3' && <Step3 />}
        </div>
      </div>
    </>
  );
};

export default SignUpContainer;
