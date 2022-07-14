import { FC, SetStateAction, Dispatch, useState, ChangeEvent } from 'react';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import BaseModal from 'components/Home/BaseModal';
import { ReactComponent as Stroke } from 'assets/illustrations/icons/stroke.svg';
import styles from './index.module.scss';
import useCreateOrganisation from './hook';

interface ComponentProps {
  onClose: () => void;
}

const StartOrgModal: FC<ComponentProps> = ({ onClose }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');

  const [showStepTwo, setShowStepTwo] = useState(false);

  // const { createOrganisation } = useCreateOrg();
  const createOrganisation = useCreateOrganisation();

  const handleCreateOrganisation = () => {
    if (orgName && orgDesc) {
      createOrganisation.mutate({
        userId: user?.userId,
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
      placeholder="Enter organisation name"
    />
  );

  const StepTwoModal = (
    <StepModal
      setInputChange={setOrgDesc}
      onClose={onClose}
      onNext={handleStepTwo}
      placeholder="Enter short description"
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
      showBtn
      header="Start an Organization"
      onClose={onClose}
      onNext={onNext}
    >
      <section className={styles.content}>
        <div className={styles.uploadPicture}>
          <Stroke height={30} width={30} />
        </div>
        <input
          type="text"
          className={styles['create-organisation-modal']}
          placeholder={placeholder}
          required
          onChange={handleInputChange}
        />
      </section>
    </BaseModal>
  );
};

export default StartOrgModal;
