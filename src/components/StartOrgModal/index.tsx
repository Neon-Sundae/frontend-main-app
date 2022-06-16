import React, { FC, useRef, useState } from 'react';
import BaseModal from 'components/Home/BaseModal';
import { ReactComponent as Stroke } from 'assets/illustrations/icons/stroke.svg';
import styles from './index.module.scss';

interface ComponentProps {
  onClose: () => void;
}

const StartOrgModal: FC<ComponentProps> = ({ onClose }) => {
  const [showStepTwo, setShowStepTwo] = useState(false);
  const orgNameInput = useRef<HTMLInputElement>(null);
  const orgDescInput = useRef<HTMLInputElement>(null);

  const handleStepOne = () => {
    const orgName = orgNameInput.current?.value;
    if (orgName?.trim().length === 0) return;

    setShowStepTwo(true);
  };

  const handleStepTwo = () => {
    const orgDesc = orgDescInput.current?.value;
    if (orgDesc?.trim().length === 0) return;

    onClose();
  };

  const StepOneModal = (
    <StepModal
      ref={orgNameInput}
      onClose={onClose}
      onNext={handleStepOne}
      placeholder="enter organisation name"
    />
  );

  const StepTwoModal = (
    <StepModal
      ref={orgDescInput}
      onClose={onClose}
      onNext={handleStepTwo}
      placeholder="enter short description"
    />
  );

  return (
    <>
      {!showStepTwo && StepOneModal}
      {showStepTwo && StepTwoModal}
    </>
  );
};

interface IStepProps {
  onClose: () => void;
  onNext: () => void;
  placeholder: string;
}

const StepModal = React.forwardRef<HTMLInputElement, IStepProps>(
  ({ onClose, onNext, placeholder }, ref) => {
    return (
      <BaseModal
        header="Start an Organization"
        onClose={onClose}
        onNext={onNext}
      >
        <section className={styles.content}>
          <div className={styles.uploadPicture}>
            <Stroke height={30} width={30} />
          </div>
          <div className={styles['input-container']}>
            <input type="text" placeholder={placeholder} required ref={ref} />
          </div>
        </section>
      </BaseModal>
    );
  }
);

export default StartOrgModal;
