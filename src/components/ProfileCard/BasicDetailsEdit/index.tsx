import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import userImage from 'assets/images/profile/user-image.png';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';
import useUpdateProfileDetails from './hooks';
import toast from 'react-hot-toast';
import useProfileManage from '../BasicDetails/hooks';

const BasicDetailsEdit: FC = () => {
  const { profile, profileContractAddress, xp } = useSelector(
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

  const updateProfileDetails = useUpdateProfileDetails();

  const handleSave = () => {
    updateProfileDetails({
      userId: user?.userId,
      profileId: profile?.profileId,
      name,
      title,
      description: bio,
    });
  };

  return (
    <>
      <ProfileImage />
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
      <i className='material-icons'>done</i>
    </div>
  );
};

const ProfileImage: FC = () => {
  return (
    <div className={styles['profile-image']}>
      <div className={styles['image-wrapper']}>
        <img alt='user' src={userImage} />
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
        type='text'
        className={styles.name}
        value={name}
        onChange={handleNameChange}
      />
      <input
        type='text'
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
        <div
          className={styles['address-container']}
          style={{ cursor: 'pointer' }}
          onClick={() => createProfile(name, title, walletId)}
        >
          <span className='material-icons' style={{ color: '#FAA5B9' }}>
            close
          </span>
          <p className={styles['profile-address']}>Mint on Chain</p>
          <div></div>
        </div>
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
          <i className='material-icons-200' onClick={handleCopyAddress}>
            content_copy
          </i>
        </div>
      )}
      <p className={styles['sync-text']}>
        Sync On Chain <i className='material-icons-200'>sync</i>
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
