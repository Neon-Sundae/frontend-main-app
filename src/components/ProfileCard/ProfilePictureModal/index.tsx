import { FC, useState } from 'react';
import Modal from 'components/Modal';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import PromptImage from 'assets/images/profile/prompt-img.png';
import styles from './index.module.scss';
import { fetchNFTs } from './hooks';

import StepOne from '../StepOne';
import StepTwo from '../StepTwo';

interface IProfilePictureModal {
  setPicture: (picture: string) => void;
  setProfilePictureModal: (profilePictureModal: boolean) => void;
  picture: string;
}

const ProfilePictureModal: FC<IProfilePictureModal> = ({
  setPicture,
  setProfilePictureModal,
  picture,
}) => {
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const [stepOne, setStepOne] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [nfts, setNfts] = useState<any>({});
  const [agree, setAgree] = useState(false);
  setPicture(picture);
  const truncatedWalletId = `${walletId?.substring(
    0,
    5
  )}...${walletId?.substring(walletId.length - 5, walletId.length)}`;
  const { isLoading, refetch } = fetchNFTs(walletId, agree);
  const getNfts = () => {
    if (Object.keys(nfts).length === 0) {
      setAgree(true);
      refetch().then((data: any) => {
        setNfts(data.data);
      });
    }
  };
  const funcMoveOn = (e: any) => {
    e.preventDefault();
    setStepOne(true);
    getNfts();
  };
  if (stepOne) {
    setTimeout(() => {
      setStepOne(false);
      setStepTwo(true);
    }, 1000);
    return (
      <StepOne
        setProfilePictureModal={setProfilePictureModal}
        setStepTwo={setStepTwo}
      />
    );
  }
  if (stepTwo) {
    return (
      <StepTwo
        setProfilePictureModal={setProfilePictureModal}
        setStepOne={setStepOne}
        setStepTwo={setStepTwo}
        setPicture={setPicture}
        nfts={nfts}
        picture={picture}
      />
    );
  }
  return (
    <Modal
      onClose={() => setProfilePictureModal(false)}
      width="550.24px"
      height="600px"
    >
      <div className={styles.wrapper}>
        <img src={PromptImage} alt="Profile" className={styles.promptImg} />
        <div className={styles.promptText}>
          <h2>Show off your prized possessions</h2>
          <p>
            Set your profile picture to an NFT you own by connecting your wallet
            and verifying address
          </p>
          <div />
          <footer>
            By connecting your wallet you authorize Founder’s Lab to extract
            your NFT information belonging to &nbsp;
            <span>{truncatedWalletId}</span>{' '}
            <span className={styles.spanLeft}>Learn More</span>
          </footer>
          <button
            onClick={e => {
              funcMoveOn(e);
            }}
          >
            Allow Access
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfilePictureModal;
