import { Oval } from 'react-loader-spinner';
import Modal from 'components/Modal';
import { FC } from 'react';
import { handleLocalStorage } from 'utils/localStorageFn';
import styles from './index.module.scss';

interface StepOneProps {
  setProfilePictureModal: (profilePictureModal: boolean) => void;
  setStepTwo: (stepTwo: boolean) => void;
}

const StepOne: FC<StepOneProps> = ({ setProfilePictureModal, setStepTwo }) => {
  return (
    <Modal
      onClose={() => {
        handleLocalStorage('partial');
        setProfilePictureModal(false);
        setStepTwo(false);
      }}
      width="596px"
      height="550px"
      overflowY="auto"
    >
      <div className={styles.center}>
        <h2>NFTs</h2>
        <div className={styles.empty} />
        <Oval
          ariaLabel="loading-indicator"
          height={96.7}
          width={96.7}
          strokeWidth={5}
          strokeWidthSecondary={1}
          color="#fff"
          secondaryColor="none"
        />
        <p>Syncing your NFT Data...</p>
      </div>
    </Modal>
  );
};
export default StepOne;
