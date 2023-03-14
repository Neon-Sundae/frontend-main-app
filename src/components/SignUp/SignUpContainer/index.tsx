import neonSundaeLogo from 'assets/illustrations/icons/neonSundaeMainLogo.png';
import { useState } from 'react';
import { getItem } from 'utils/localStorageFn';
import BlurBlobs from 'components/BlurBlobs';
import TopGradientBar from 'components/TopGradientBar';
import Step0 from '../Step0';
import Step1 from '../Step1';
import Step2 from '../Step2';
import Step3 from '../Step3';
import styles from './index.module.scss';

const SignUpContainer = () => {
  const [step, setStep] = useState(getItem('nextStep') || 'step0');

  return (
    <>
      <TopGradientBar />
      <BlurBlobs />
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
          {step === 'step0' && <Step0 setStep={setStep} />}
          {step === 'step1' && <Step1 setStep={setStep} />}
          {step === 'step2' && <Step2 setStep={setStep} />}
          {step === 'step3' && <Step3 />}
        </div>
      </div>
    </>
  );
};

export default SignUpContainer;
