import { FC, useEffect, useState, useRef } from 'react';
import Modal from 'components/Modal';
import getRandomString from 'utils/getRandomString';
import toast from 'react-hot-toast';
import userImage from 'assets/images/profile/user-image.png';
import styles from './index.module.scss';

interface StepTwoProps {
  setProfilePictureModal: (profilePictureModal: boolean) => void;
  setStepOne: (stepOne: boolean) => void;
  setStepTwo: (stepTwo: boolean) => void;
  nfts: any;
}
const StepTwo: FC<StepTwoProps> = ({
  setProfilePictureModal,
  setStepOne,
  setStepTwo,
  nfts,
}) => {
  const [selectedNFTId, setSelectedNFTId] = useState('');
  useEffect(() => {
    const el = document.getElementById(selectedNFTId);
    el?.classList.add(styles.selected);
  }, [selectedNFTId]);

  const [picture, setPicture] = useState('');
  const extractSelectedImageUri = (data: any) => {
    if (!data.length) {
      toast.error("NFT doesn't have image! Select another");
      setSelectedNFTId('');
    }
    setPicture(data);
  };
  const getTokenMetadata = (token: any) => {
    const metadata = JSON.parse(token.metadata);
    return {
      name: metadata?.name,
      description: metadata?.description,
      externalLink: metadata?.external_link,
      attributes: metadata?.attributes,
      animation: metadata?.animation,
      animationUrl: metadata?.animation_url,
      image: metadata?.image,
    };
  };
  const handleNFTClick = (tokenId: any) => {
    setSelectedNFTId(tokenId);
  };
  return (
    <Modal
      onClose={() => {
        setStepOne(false);
        setStepTwo(false);
        setProfilePictureModal(false);
      }}
      width="599px"
      height="711px"
      overflowY="auto"
    >
      <div className={styles.nftsWrapper}>
        <h2>NFTs</h2>
        <div className={styles.nftsContainer}>
          {nfts?.result.map((token: any) => {
            const metadata = getTokenMetadata(token);
            let ipfsHash = null;
            if (metadata.image) ipfsHash = metadata.image.slice(7);
            return (
              <span
                className={styles.singleNft}
                key={getRandomString(5)}
                id={token.token_id}
                onClick={() => {
                  handleNFTClick(token.token_id);
                  extractSelectedImageUri(
                    metadata.image
                      ? metadata.image.replace(
                          'ipfs://',
                          'https://ipfs.io/ipfs/'
                        )
                      : ''
                  );
                }}
              >
                <img
                  src={
                    ipfsHash
                      ? `https://gateway.ipfs.io/ipfs/${ipfsHash}`
                      : userImage
                  }
                  alt="NFT"
                />
                <h3>{metadata.name ? metadata.name : 'no data'}</h3>
                <p>
                  {metadata.description && metadata.description.length > 20
                    ? `${metadata.description.substring(0, 18)}...`
                    : metadata.description}
                </p>
              </span>
            );
          })}
        </div>
        <button
          onClick={() => {
            if (!selectedNFTId) {
              toast.error('Please select an NFT first');
              return;
            }
            setStepOne(false);
            setStepTwo(false);
            setProfilePictureModal(false);
          }}
        >
          Select NFT
        </button>
      </div>
    </Modal>
  );
};

export default StepTwo;
