import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import toast from 'react-hot-toast';
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';
import Background from 'assets/illustrations/profile/pp-bg.png';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import { useParams } from 'react-router-dom';
import {
  useFetchProfileDetailsWrapper,
  useUpdateProfileDetails,
} from 'queries/profile';
import { useFetchUserDetailsWrapper, useUpdateUserDetails } from 'queries/user';
import { editProfile } from 'actions/profile';
import styles from './index.module.scss';
import ProfilePictureModal from '../ProfilePictureModal';

const BasicDetailsEdit: FC = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsWrapper(params.profileId);
  const updateProfileDetails = useUpdateProfileDetails({
    profileId: params.profileId,
  });
  const updateUserDetails = useUpdateUserDetails({
    userId: userData?.user?.userId,
  });

  const { xp } = useSelector((state: RootState) => state.profile);

  const [name, setName] = useState(profileData?.user?.name || '');
  const [title, setTitle] = useState(profileData?.title || 'Product Designer');
  const [bio, setBio] = useState(
    profileData?.description ||
      `Lorem imsum text is here imsum text is here imsum text is here imsum
  text is here imsum text is here imsum text is here imsum text is here
  imsum.`
  );
  const [picture, setPicture] = useState<any>(profileData?.picture || null);

  const handleSave = async () => {
    const promise1 = updateProfileDetails.mutateAsync({
      payload: {
        title,
        description: bio,
        picture,
      },
    });
    const promise2 = updateUserDetails.mutateAsync({
      payload: {
        name,
      },
    });

    await Promise.allSettled([promise1, promise2]);
    dispatch(editProfile(false));
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
      <div id="user-profile-mint">
        <ExperiencePoints xp={xp} />
        <ProfileAddressChain
          profileSmartContractId={profileData?.profileSmartContractId}
        />
      </div>
      <ProfileBio bio={bio || 'Add your bio'} setBio={setBio} />
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
  const { user } = useSelector((state: RootState) => state.user);
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
          id="profile-edit-icon"
          alt="user"
          src={
            picture || getDefaultAvatarSrc(user?.name?.charAt(0).toUpperCase())
          }
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
    <div id="user-xp" className={styles['experience-points']}>
      <span className={styles.value}>
        {xp} <span className={styles.label}>XP</span>
      </span>
    </div>
  );
};

interface IProfileAddressChain {
  profileSmartContractId: string | null | undefined;
}

const ProfileAddressChain: FC<IProfileAddressChain> = ({
  profileSmartContractId,
}) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profileSmartContractId ?? '');
    toast.success('Copied!');
  };

  return (
    <div className={styles['profile-address-chain']}>
      {profileSmartContractId ===
        '0x0000000000000000000000000000000000000000' ||
      profileSmartContractId === null ||
      profileSmartContractId === '' ? (
        <div
          id="profile-address-container"
          className={styles['address-container']}
          style={{ cursor: 'pointer' }}
          onClick={() => toast.error('Save your edits to mint your profile')}
        >
          <span className="material-icons" style={{ color: '#FAA5B9' }}>
            close
          </span>
          <p className={styles['profile-address']}>Mint on Chain</p>
        </div>
      ) : (
        <div className={styles['address-container']}>
          <FoundersLabIcon width={28} height={28} />
          <p className={styles['profile-address']}>
            {profileSmartContractId?.slice(0, 6)}...
            {profileSmartContractId?.slice(
              profileSmartContractId.length - 6,
              profileSmartContractId.length
            )}
          </p>
          <i
            className="material-icons-200"
            style={{ cursor: 'pointer' }}
            onClick={handleCopyAddress}
          >
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
