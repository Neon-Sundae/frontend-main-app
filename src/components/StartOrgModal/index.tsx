import { FC, SetStateAction, Dispatch, useState, ChangeEvent } from 'react';
import BaseModal from 'components/Home/BaseModal';
import { ReactComponent as Stroke } from 'assets/illustrations/icons/stroke.svg';
import styles from './index.module.scss';
import useCreateOrg from './hook';

interface ComponentProps {
  onClose: () => void;
}

const StartOrgModal: FC<ComponentProps> = ({ onClose }) => {
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');

  const [showStepTwo, setShowStepTwo] = useState(false);

  const { createOrganisation } = useCreateOrg();

  const handleCreateOrganisation = () => {
    if (orgName && orgDesc) {
      createOrganisation({
        name: orgName,
        description: orgDesc,
      });
    }
  };

  const handleStepOne = () => {
    if (orgName.trim().length === 0) return;

    setShowStepTwo(true);
  };

  const handleStepTwo = () => {
    if (orgDesc.trim().length === 0) return;

    handleCreateOrganisation();
  };

  const StepOneModal = (
    <StepModal
      setInputChange={setOrgName}
      onClose={onClose}
      onNext={handleStepOne}
      placeholder="enter organisation name"
    />
  );

  const StepTwoModal = (
    <StepModal
      setInputChange={setOrgDesc}
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
  setInputChange: Dispatch<SetStateAction<string>>;
}

const StepModal: FC<IStepProps> = ({
  onClose,
  onNext,
  placeholder,
  setInputChange,
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputChange(event.target.value);
  };
  return (
    <BaseModal
      header="Start an Organization"
      onClose={onClose}
      onNext={onNext}
      showBtn={true}
    >
      <section className={styles.content}>
        <div className={styles.uploadPicture}>
          <Stroke height={30} width={30} />
        </div>
        <div className={styles['input-container']}>
          <input
            type="text"
            placeholder={placeholder}
            required
            onChange={handleInputChange}
          />
        </div>
      </section>
    </BaseModal>
  );
};

export default StartOrgModal;
