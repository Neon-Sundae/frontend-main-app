import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import userImage from 'assets/images/profile/user-image.png';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import toast from 'react-hot-toast';
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';
import Background from 'assets/illustrations/profile/pp-bg.png';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { useMutation } from '@tanstack/react-query';
import useProfileManage from '../BasicDetails/hooks';
import styles from './index.module.scss';
import { useUpdateProfileDetails } from './hooks';
import ProfilePictureModal from '../ProfilePictureModal';

const BasicDetailsEdit: FC = () => {
  const { profile, profileContractAddress, xp } = useSelector(
    (state: RootState) => state.profile
  );
  const profileId = profile?.profileId ? profile.profileId : 0;
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
  const updateProfileDetails = useUpdateProfileDetails();
  const { mutate: updateProfilePicture } = useMutation(
    async () => {
      return fetch(`${config.ApiBaseUrl}/profile/${profileId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ picture }),
      });
    },
    {
      onSuccess: (res: any) => {
        console.log('success', res);
      },
      onError: (err: any) => {
        console.log('err', err);
      },
    }
  );

  const handleSave = () => {
    updateProfileDetails({
      userId: user?.userId,
      profileId: profile?.profileId,
      name,
      title,
      description: bio,
      picture,
    });
    updateProfilePicture();
  };
  return (
    <>
      <ProfileImage picture={picture} setPicture={setPicture} />
      <NameDesignation
        title={title}
        setTitle={setTitle}
        name={name}
        setName={setName}
      />
      <ExperiencePoints xp={xp} />
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
  picture: string;
  setPicture: (picture: string) => void;
}

const ProfileImage: FC<IProfileImage> = ({ picture, setPicture }) => {
  const [profilePictureModal, setProfilePictureModal] = useState(false);
  if (profilePictureModal) {
    return (
      <ProfilePictureModal
        setPicture={setPicture}
        setProfilePictureModal={setProfilePictureModal}
        picture={picture}
      />
    );
  }
  return (
    <div
      className={styles['profile-image']}
      onClick={() => {
        setProfilePictureModal(true);
      }}
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

interface IExperiencePoints {
  xp: number;
}
const ExperiencePoints: FC<IExperiencePoints> = ({ xp }) => {
  return (
    <div className={styles['experience-points']}>
      <span className={styles.value}>
        {xp} <span className={styles.label}>XP</span>
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
