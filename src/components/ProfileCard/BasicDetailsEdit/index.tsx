import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import userImage from 'assets/images/profile/user-image.png';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';

import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import PromptImage from 'assets/images/profile/prompt-img.png';

import { Oval } from 'react-loader-spinner';
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';
import Background from 'assets/illustrations/profile/pp-bg.png';
import getRandomString from 'utils/getRandomString';
import useProfileManage from '../BasicDetails/hooks';
import styles from './index.module.scss';

import { useUpdateProfileDetails, fetchNFTs } from './hooks';

const BasicDetailsEdit: FC = () => {
  const { profile, profileContractAddress } = useSelector(
    (state: RootState) => state.profile
  );
  const user = useSelector((state: RootState) => state.user.user);

  const [name, setName] = useState(user?.name ?? 'Rachel Green');
  const [title, setTitle] = useState(profile?.title ?? 'Product Designer');
  const [bio, setBio] = useState(
    profile?.description ??
    `Lorem imsum text is here imsum text is here imsum text is here imsum
  text is here imsum text is here imsum text is here imsum text is here
  imsum.`
  );
  const [picture, setPicture] = useState(profile?.picture ?? userImage);
  const [nfts, setNfts] = useState({});
  const [agree, setAgree] = useState(false);
  const updateProfileDetails = useUpdateProfileDetails();
  const handleSave = () => {
    updateProfileDetails({
      userId: user?.userId,
      profileId: profile?.profileId,
      name,
      title,
      description: bio,
      picture,
    });
  };
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { data, isLoading, refetch } = fetchNFTs(walletId, agree);
  const getNfts = () => {
    if (Object.keys(nfts).length === 0) {
      setAgree(true);
      refetch();
      setNfts(data);
    }
  };
  return (
    <>
      <ProfileImage
        nfts={nfts}
        picture={picture}
        setPicture={setPicture}
        getNFTs={getNfts}
      />
      <NameDesignation
        title={title}
        setTitle={setTitle}
        name={name}
        setName={setName}
      />
      <ExperiencePoints />
      <ProfileAddressChain
        name={name}
        profileContractAddress={profileContractAddress}
        walletId={user?.walletId}
        title={title}
      />
      <ProfileBio bio={bio} setBio={setBio} />
      <SaveProfile handleSave={handleSave} />
    </>
  );
};

interface ISaveProfile {
  handleSave: () => void;
}

const SaveProfile: FC<ISaveProfile> = ({ handleSave }) => {
  return (
    <div className={styles['save-profile']} onClick={handleSave}>
      <span className={styles.text}>Save</span>
      <i className="material-icons">done</i>
    </div>
  );
};

interface IProfileImage {
  nfts: any;
  picture?: string;
  setPicture: (picture: string) => void;
  getNFTs: () => void;
}

const ProfileImage: FC<IProfileImage> = ({
  nfts,
  picture,
  setPicture,
  getNFTs,
}) => {
  const [profileModal, setProfileModal] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [finStep, setFinStep] = useState(false);
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
  const extractSelectedImageUri = (data: any) => {
    if (!data.length) {
      toast.error("NFT doesn't have image! Select another");
    }
    setPicture(data);
  };
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const truncatedWalletId = `${walletId?.substring(
    0,
    5
  )}...${walletId?.substring(walletId.length - 5, walletId.length)}`;
  if (profileModal) {
    return (
      <Modal
        onClose={() => setProfileModal(false)}
        width="599px"
        height="711px"
      >
        <div className={styles.wrapper}>
          <img src={PromptImage} alt="Profile" className={styles.promptImg} />
          <div className={styles.promptText}>
            <h2>Show off your prized possessions</h2>
            <p>
              Set your profile picture to an NFT you own by connnecting your
              wallet and verifiying address
            </p>
            <div />
            <footer>
              By connecting your wallet you authorise Founder’s Lab to extract
              your NFT information belonging to
              <span> {truncatedWalletId} Learn More</span>
            </footer>
            <button
              onClick={e => {
                e.preventDefault();
                setStepTwo(true);
                setProfileModal(false);
                getNFTs();
              }}
            >
              Allow Access
            </button>
          </div>
        </div>
      </Modal>
    );
  }
  if (stepTwo) {
    setTimeout(() => {
      setFinStep(true);
      setStepTwo(false);
      setProfileModal(false);
    }, 2000);
    return (
      <Modal
        onClose={() => {
          setProfileModal(false);
          setStepTwo(false);
        }}
        width="650px"
        height="482.13px"
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
  }
  if (finStep) {
    return (
      <Modal
        onClose={() => {
          setProfileModal(false);
          setStepTwo(false);
          setFinStep(false);
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
              return (
                <span
                  className={styles.singleNft}
                  key={getRandomString(5)}
                  onClick={() => {
                    console.log('clicked!');
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
                      metadata.image
                        ? metadata.image.replace(
                          'ipfs://',
                          'https://ipfs.io/ipfs/'
                        )
                        : userImage
                    }
                    alt="NFT"
                  />
                  <h3>{metadata.name ? metadata.name : 'no data'}</h3>
                  <p>
                    {metadata.description ? metadata.description : 'no data'}
                  </p>
                </span>
              );
            })}
          </div>
          <button
            onClick={() => {
              setFinStep(false);
              setStepTwo(false);
              setProfileModal(false);
            }}
          >
            Select NFT
          </button>
        </div>
      </Modal>
    );
  }
  return (
    <div
      className={styles['profile-image']}
      onClick={() => setProfileModal(true)}
    >
      <div className={styles['image-wrapper']}>
        <img
          alt="user"
          src={picture || userImage}
          className={styles.userImage}
        />
        <img alt="background" src={Background} className={styles.bgImage} />
        <EditIcon className={styles.editIcon} />
      </div>
    </div>
  );
};

ProfileImage.defaultProps = {
  picture: userImage,
};

interface INameDesignation {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

const NameDesignation: FC<INameDesignation> = ({
  title,
  setTitle,
  name,
  setName,
}) => {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  return (
    <div className={styles['name-designation']}>
      <input
        type="text"
        className={styles.name}
        value={name}
        onChange={handleNameChange}
      />
      <input
        type="text"
        className={styles.designation}
        value={title}
        onChange={handleTitleChange}
      />
    </div>
  );
};

const ExperiencePoints: FC = () => {
  return (
    <div className={styles['experience-points']}>
      <span className={styles.value}>
        1230 <span className={styles.label}>XP</span>
      </span>
    </div>
  );
};

interface IProfileAddressChain {
  profileContractAddress: string;
  name: string;
  walletId: string | undefined;
  title: string;
}

const ProfileAddressChain: FC<IProfileAddressChain> = ({
  profileContractAddress,
  name,
  walletId,
  title,
}) => {
  const { createProfile } = useProfileManage();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profileContractAddress);
    toast.success('Copied!');
  };

  return (
    <div className={styles['profile-address-chain']}>
      {profileContractAddress ===
        '0x0000000000000000000000000000000000000000' ? (
        <>
          <div
            className={styles['address-container']}
            style={{ cursor: 'pointer' }}
            onClick={() => createProfile(name, title, walletId)}
          />
          <span className="material-icons" style={{ color: '#FAA5B9' }}>
            close
          </span>
          <p className={styles['profile-address']}>Mint on Chain</p>
          <div />
        </>
      ) : (
        <div className={styles['address-container']}>
          <FoundersLabIcon width={28} height={28} />
          <p className={styles['profile-address']}>
            {profileContractAddress?.slice(0, 6)}...
            {profileContractAddress?.slice(
              profileContractAddress.length - 6,
              profileContractAddress.length
            )}
          </p>
          <i className="material-icons-200" onClick={handleCopyAddress}>
            content_copy
          </i>
        </div>
      )}
      <p className={styles['sync-text']}>
        Sync On Chain <i className="material-icons-200">sync</i>
      </p>
    </div>
  );
};

interface IProfileBio {
  bio: string;
  setBio: Dispatch<SetStateAction<string>>;
}

const ProfileBio: FC<IProfileBio> = ({ bio, setBio }) => {
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setBio(e.target.value);

  return (
    <textarea
      className={styles['profile-bio']}
      maxLength={140}
      value={bio}
      onChange={handleDescriptionChange}
    />
  );
};

export default BasicDetailsEdit;
